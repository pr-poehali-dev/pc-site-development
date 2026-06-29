import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import psycopg2


def _resp(status, body):
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
            'Access-Control-Max-Age': '86400',
        },
        'isBase64Encoded': False,
        'body': json.dumps(body),
    }


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def handler(event: dict, context):
    '''
    Авторизация администраторов магазина White Friday PC.
    Поддерживает: login (вход по логину/паролю), verify (проверка токена),
    create_admin (создание нового админа существующим админом).
    '''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return _resp(200, {})

    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cur = conn.cursor()
    _ensure_schema(cur)

    try:
        body = json.loads(event.get('body') or '{}')
        action = body.get('action', 'login')

        if action == 'setup':
            cur.execute("SELECT COUNT(*) FROM admins")
            if cur.fetchone()[0] > 0:
                return _resp(403, {'error': 'Администратор уже создан'})
            username = (body.get('username') or '').strip()
            password = body.get('password') or ''
            full_name = (body.get('full_name') or 'Главный администратор').strip()
            if not username or not password:
                return _resp(400, {'error': 'Укажите логин и пароль'})
            cur.execute(
                "INSERT INTO admins (username, password_hash, full_name) VALUES (%s, %s, %s) RETURNING id",
                (username, _hash_password(password), full_name)
            )
            return _resp(200, {'success': True, 'id': cur.fetchone()[0]})

        if action == 'needs_setup':
            cur.execute("SELECT COUNT(*) FROM admins")
            return _resp(200, {'needs_setup': cur.fetchone()[0] == 0})

        if action == 'login':
            username = (body.get('username') or '').strip()
            password = body.get('password') or ''
            if not username or not password:
                return _resp(400, {'error': 'Укажите логин и пароль'})
            cur.execute(
                "SELECT id, password_hash, full_name FROM admins WHERE username = %s",
                (username,)
            )
            row = cur.fetchone()
            if not row or row[1] != _hash_password(password):
                return _resp(401, {'error': 'Неверный логин или пароль'})
            admin_id, _, full_name = row
            token = secrets.token_urlsafe(32)
            expires = datetime.utcnow() + timedelta(days=30)
            cur.execute(
                "INSERT INTO admin_sessions (admin_id, token, expires_at) VALUES (%s, %s, %s)",
                (admin_id, token, expires)
            )
            return _resp(200, {
                'token': token,
                'username': username,
                'full_name': full_name,
            })

        if action == 'verify':
            token = body.get('token') or event.get('headers', {}).get('X-Auth-Token', '')
            admin = _get_admin_by_token(cur, token)
            if not admin:
                return _resp(401, {'error': 'Сессия недействительна'})
            return _resp(200, {'valid': True, 'username': admin[1], 'full_name': admin[2]})

        if action == 'create_admin':
            token = body.get('token') or event.get('headers', {}).get('X-Auth-Token', '')
            admin = _get_admin_by_token(cur, token)
            if not admin:
                return _resp(401, {'error': 'Требуется авторизация'})
            new_username = (body.get('new_username') or '').strip()
            new_password = body.get('new_password') or ''
            full_name = (body.get('full_name') or '').strip()
            if not new_username or not new_password:
                return _resp(400, {'error': 'Укажите логин и пароль нового админа'})
            cur.execute("SELECT id FROM admins WHERE username = %s", (new_username,))
            if cur.fetchone():
                return _resp(409, {'error': 'Админ с таким логином уже существует'})
            cur.execute(
                "INSERT INTO admins (username, password_hash, full_name) VALUES (%s, %s, %s) RETURNING id",
                (new_username, _hash_password(new_password), full_name)
            )
            return _resp(200, {'success': True, 'id': cur.fetchone()[0]})

        return _resp(400, {'error': 'Неизвестное действие'})
    finally:
        cur.close()
        conn.close()


def _get_admin_by_token(cur, token: str):
    if not token:
        return None
    cur.execute(
        """SELECT a.id, a.username, a.full_name
           FROM admin_sessions s
           JOIN admins a ON a.id = s.admin_id
           WHERE s.token = %s AND s.expires_at > NOW()""",
        (token,)
    )
    return cur.fetchone()


def _ensure_schema(cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS admins (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS admin_sessions (
            id SERIAL PRIMARY KEY,
            admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
            token VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
    """)