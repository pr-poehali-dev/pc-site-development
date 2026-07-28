import json
import os
import base64
import uuid
from datetime import datetime

import psycopg2
import psycopg2.extras
import boto3


CORS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}

BUILD_FIELDS = (
    'name', 'tagline', 'price', 'image_url', 'build_date', 'cpu', 'gpu',
    'motherboard', 'ram', 'storage', 'psu', 'cpu_cooling', 'fans', 'extras',
    'case_model', 'is_published', 'sort_order',
)

EXT_BY_TYPE = {'photo': 'jpg', 'video': 'mp4'}
CT_BY_TYPE = {'photo': 'image/jpeg', 'video': 'video/mp4'}


def _resp(status, body):
    return {
        'statusCode': status,
        'headers': CORS,
        'isBase64Encoded': False,
        'body': json.dumps(body, default=str),
    }


def _db():
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    return conn


def _is_admin(cur, token: str) -> bool:
    if not token:
        return False
    cur.execute(
        "SELECT 1 FROM admin_sessions WHERE token = %s AND expires_at > NOW()",
        (token,)
    )
    return cur.fetchone() is not None


def _s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )


def _cdn_url(key: str) -> str:
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def _decode(b64: str) -> bytes:
    if ',' in b64 and b64.strip().startswith('data:'):
        b64 = b64.split(',', 1)[1]
    return base64.b64decode(b64)


def _upload_file(data: bytes, kind: str) -> str:
    ext = EXT_BY_TYPE.get(kind, 'bin')
    ct = CT_BY_TYPE.get(kind, 'application/octet-stream')
    key = f"builds/{uuid.uuid4().hex}.{ext}"
    _s3().put_object(Bucket='files', Key=key, Body=data, ContentType=ct)
    return _cdn_url(key)


def _load_media(cur, build_id: int) -> list:
    cur.execute(
        "SELECT id, url, media_type, sort_order FROM build_media "
        "WHERE build_id = %s ORDER BY sort_order ASC, id ASC",
        (build_id,)
    )
    return [dict(r) for r in cur.fetchall()]


def _replace_media(cur, build_id: int, media: list):
    '''Пересоздаёт список медиа сборки. base64 — новый файл (грузим в S3), url — уже готовый/embed.'''
    cur.execute("DELETE FROM build_media WHERE build_id = %s", (build_id,))
    order = 0
    for m in media or []:
        mtype = m.get('media_type') or 'photo'
        if m.get('base64'):
            url = _upload_file(_decode(m['base64']), 'video' if mtype == 'video' else 'photo')
        else:
            url = m.get('url')
        if not url:
            continue
        cur.execute(
            "INSERT INTO build_media (build_id, url, media_type, sort_order) VALUES (%s, %s, %s, %s)",
            (build_id, url, mtype, order)
        )
        order += 1


def _first_photo_url(cur, build_id: int):
    cur.execute(
        "SELECT url FROM build_media WHERE build_id = %s AND media_type = 'photo' "
        "ORDER BY sort_order ASC, id ASC LIMIT 1",
        (build_id,)
    )
    row = cur.fetchone()
    return row['url'] if row else None


def _serialize(cur, row) -> dict:
    b = dict(row)
    b['media'] = _load_media(cur, b['id'])
    return b


# ---------- Чанковая загрузка видео (склейка через временные объекты S3) ----------

def _chunk_key(session: str, part: int) -> str:
    return f"builds/_chunks/{session}/part_{part:05d}"


def chunk_init(body: dict) -> dict:
    session = uuid.uuid4().hex
    filename = body.get('filename') or 'video.mp4'
    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else 'mp4'
    content_type = body.get('content_type') or 'video/mp4'
    return {'session': session, 'ext': ext, 'content_type': content_type}


def chunk_part(body: dict) -> dict:
    session = body['session']
    part = int(body['part_number'])
    data = _decode(body['base64'])
    _s3().put_object(Bucket='files', Key=_chunk_key(session, part), Body=data)
    return {'ok': True}


def chunk_finish(body: dict) -> dict:
    session = body['session']
    total = int(body['total'])
    ext = (body.get('ext') or 'mp4').lower()
    content_type = body.get('content_type') or 'video/mp4'
    s3 = _s3()
    buf = bytearray()
    for i in range(1, total + 1):
        obj = s3.get_object(Bucket='files', Key=_chunk_key(session, i))
        buf.extend(obj['Body'].read())
    key = f"builds/{uuid.uuid4().hex}.{ext}"
    s3.put_object(Bucket='files', Key=key, Body=bytes(buf), ContentType=content_type)
    _cleanup_chunks(s3, session, total)
    return {'url': _cdn_url(key)}


def chunk_abort(body: dict) -> dict:
    _cleanup_chunks(_s3(), body['session'], int(body.get('total') or 0))
    return {'ok': True}


def _cleanup_chunks(s3, session: str, total: int):
    for i in range(1, total + 1):
        try:
            s3.delete_object(Bucket='files', Key=_chunk_key(session, i))
        except Exception:
            pass


def handler(event: dict, context):
    '''
    Управление сборками ПК (каталог "Наши проекты" и карусель на главной).
    GET — опубликованные сборки (или все с ?all=1 и токеном админа).
    POST/PUT/DELETE — создание, изменение, удаление, загрузка медиа (только админ).
    '''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return _resp(200, {})

    conn = _db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        headers = event.get('headers') or {}
        token = headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''

        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            if params.get('all') == '1':
                if not _is_admin(cur, token):
                    return _resp(401, {'error': 'Требуется авторизация'})
                cur.execute("SELECT * FROM builds ORDER BY sort_order ASC, id DESC")
            else:
                cur.execute(
                    "SELECT * FROM builds WHERE is_published = TRUE "
                    "ORDER BY sort_order ASC, id DESC"
                )
            rows = cur.fetchall()
            return _resp(200, {'builds': [_serialize(cur, r) for r in rows]})

        if not _is_admin(cur, token):
            return _resp(401, {'error': 'Требуется авторизация'})

        body = json.loads(event.get('body') or '{}')
        action = body.get('action')

        # --- Загрузка одного файла ---
        if action == 'upload':
            kind = 'video' if body.get('kind') == 'video' else 'photo'
            url = _upload_file(_decode(body['base64']), kind)
            return _resp(200, {'url': url})

        # --- Чанковая загрузка видео ---
        if action == 'chunk_init':
            return _resp(200, chunk_init(body))
        if action == 'chunk_part':
            return _resp(200, chunk_part(body))
        if action == 'chunk_finish':
            return _resp(200, chunk_finish(body))
        if action == 'chunk_abort':
            return _resp(200, chunk_abort(body))

        if method == 'POST':
            name = (body.get('name') or '').strip()
            if not name:
                return _resp(400, {'error': 'Укажите название сборки'})
            cur.execute("SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM builds")
            next_order = cur.fetchone()['n']
            cur.execute(
                "INSERT INTO builds (name, tagline, price, image_url, build_date, cpu, gpu, "
                "motherboard, ram, storage, psu, cpu_cooling, fans, extras, case_model, "
                "is_published, sort_order) VALUES "
                "(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *",
                (
                    name, body.get('tagline'), int(body.get('price') or 0),
                    body.get('image_url'), body.get('build_date') or None,
                    body.get('cpu'), body.get('gpu'), body.get('motherboard'),
                    body.get('ram'), body.get('storage'), body.get('psu'),
                    body.get('cpu_cooling'), body.get('fans'), body.get('extras'),
                    body.get('case_model'),
                    bool(body.get('is_published', True)), next_order,
                )
            )
            build = cur.fetchone()
            bid = build['id']
            if 'media' in body:
                _replace_media(cur, bid, body['media'])
                img = _first_photo_url(cur, bid)
                cur.execute("UPDATE builds SET image_url = %s WHERE id = %s RETURNING *", (img, bid))
                build = cur.fetchone()
            return _resp(200, _serialize(cur, build))

        if method == 'PUT':
            build_id = body.get('id')
            if not build_id:
                return _resp(400, {'error': 'Не указан id сборки'})
            cur.execute("SELECT * FROM builds WHERE id = %s", (build_id,))
            if not cur.fetchone():
                return _resp(404, {'error': 'Сборка не найдена'})

            fields = {}
            for key in BUILD_FIELDS:
                if key in body:
                    val = body[key]
                    if key == 'price':
                        val = int(val or 0)
                    if key == 'build_date' and not val:
                        val = None
                    fields[key] = val

            if 'media' in body:
                _replace_media(cur, int(build_id), body['media'])
                fields['image_url'] = _first_photo_url(cur, int(build_id))

            if fields:
                fields['updated_at'] = datetime.utcnow()
                set_clause = ', '.join(f"{k} = %s" for k in fields)
                values = list(fields.values()) + [build_id]
                cur.execute(f"UPDATE builds SET {set_clause} WHERE id = %s RETURNING *", values)
            else:
                cur.execute("SELECT * FROM builds WHERE id = %s", (build_id,))
            return _resp(200, _serialize(cur, cur.fetchone()))

        if method == 'DELETE':
            build_id = body.get('id')
            if not build_id:
                return _resp(400, {'error': 'Не указан id сборки'})
            cur.execute("DELETE FROM build_media WHERE build_id = %s", (build_id,))
            cur.execute("DELETE FROM builds WHERE id = %s", (build_id,))
            return _resp(200, {'success': True})

        return _resp(400, {'error': 'Метод не поддерживается'})
    finally:
        cur.close()
        conn.close()
