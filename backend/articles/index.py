import json
import os
import re
import base64
import uuid
from datetime import datetime
import psycopg2
import psycopg2.extras
import boto3


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
        'body': json.dumps(body, default=str),
    }


def _slugify(text: str) -> str:
    translit = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    }
    text = (text or '').lower().strip()
    text = ''.join(translit.get(ch, ch) for ch in text)
    text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
    return text or 'article'


def _is_admin(cur, token: str) -> bool:
    if not token:
        return False
    cur.execute(
        "SELECT 1 FROM admin_sessions WHERE token = %s AND expires_at > NOW()",
        (token,)
    )
    return cur.fetchone() is not None


def _row_to_dict(row):
    return dict(row)


def _upload_cover(cover_base64: str) -> str:
    if ',' in cover_base64:
        cover_base64 = cover_base64.split(',', 1)[1]
    data = base64.b64decode(cover_base64)
    key = f"articles/{uuid.uuid4().hex}.jpg"
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=data, ContentType='image/jpeg')
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def handler(event: dict, context):
    '''
    Управление статьями блога White Friday PC.
    GET — список опубликованных статей (или все с ?all=1 и токеном админа).
    POST/PUT/DELETE — создание, изменение и удаление статей (только для админов).
    '''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return _resp(200, {})

    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    try:
        headers = event.get('headers') or {}
        token = headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''

        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            want_all = params.get('all') == '1'
            slug = params.get('slug')

            if slug:
                cur.execute("SELECT * FROM articles WHERE slug = %s", (slug,))
                row = cur.fetchone()
                if not row:
                    return _resp(404, {'error': 'Статья не найдена'})
                if not row['is_published'] and not _is_admin(cur, token):
                    return _resp(404, {'error': 'Статья не найдена'})
                return _resp(200, {'article': _row_to_dict(row)})

            if want_all:
                if not _is_admin(cur, token):
                    return _resp(401, {'error': 'Требуется авторизация'})
                cur.execute("SELECT * FROM articles ORDER BY sort_order ASC, id DESC")
            else:
                cur.execute(
                    "SELECT * FROM articles WHERE is_published = TRUE "
                    "ORDER BY sort_order ASC, published_at DESC NULLS LAST, id DESC"
                )
            rows = cur.fetchall()
            return _resp(200, {'articles': [_row_to_dict(r) for r in rows]})

        if not _is_admin(cur, token):
            return _resp(401, {'error': 'Требуется авторизация'})

        body = json.loads(event.get('body') or '{}')

        if body.get('cover_base64'):
            body['cover_url'] = _upload_cover(body['cover_base64'])

        if method == 'POST':
            title = (body.get('title') or '').strip()
            if not title:
                return _resp(400, {'error': 'Укажите заголовок статьи'})
            slug = (body.get('slug') or '').strip() or _slugify(title)
            excerpt = body.get('excerpt')
            content = body.get('content')
            cover_url = body.get('cover_url')
            author = body.get('author')
            is_published = bool(body.get('is_published', False))
            sort_order = int(body.get('sort_order', 0))
            published_at = datetime.utcnow() if is_published else None

            # Уникальность slug
            base_slug = slug
            i = 1
            while True:
                cur.execute("SELECT 1 FROM articles WHERE slug = %s", (slug,))
                if not cur.fetchone():
                    break
                i += 1
                slug = f"{base_slug}-{i}"

            cur.execute(
                """INSERT INTO articles
                   (title, slug, excerpt, content, cover_url, author, is_published, sort_order, published_at)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                (title, slug, excerpt, content, cover_url, author, is_published, sort_order, published_at)
            )
            return _resp(200, {'article': _row_to_dict(cur.fetchone())})

        if method == 'PUT':
            article_id = body.get('id')
            if not article_id:
                return _resp(400, {'error': 'Не указан id статьи'})

            cur.execute("SELECT * FROM articles WHERE id = %s", (article_id,))
            existing = cur.fetchone()
            if not existing:
                return _resp(404, {'error': 'Статья не найдена'})

            fields = {}
            for key in ('title', 'slug', 'excerpt', 'content', 'cover_url', 'author', 'sort_order'):
                if key in body:
                    fields[key] = body[key]

            if 'is_published' in body:
                new_pub = bool(body['is_published'])
                fields['is_published'] = new_pub
                if new_pub and not existing['published_at']:
                    fields['published_at'] = datetime.utcnow()

            if not fields:
                return _resp(400, {'error': 'Нет данных для обновления'})

            fields['updated_at'] = datetime.utcnow()
            set_clause = ', '.join(f"{k} = %s" for k in fields)
            values = list(fields.values()) + [article_id]
            cur.execute(f"UPDATE articles SET {set_clause} WHERE id = %s RETURNING *", values)
            return _resp(200, {'article': _row_to_dict(cur.fetchone())})

        if method == 'DELETE':
            article_id = body.get('id')
            if not article_id:
                return _resp(400, {'error': 'Не указан id статьи'})
            cur.execute("DELETE FROM articles WHERE id = %s", (article_id,))
            return _resp(200, {'success': True})

        return _resp(400, {'error': 'Метод не поддерживается'})
    finally:
        cur.close()
        conn.close()