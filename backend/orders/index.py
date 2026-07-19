import json
import os
from datetime import datetime

import requests
import psycopg2
import psycopg2.extras

BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
API_URL = f'https://api.telegram.org/bot{BOT_TOKEN}'

# Рабочий чат и тема "Новый заказ с сайта"
ORDERS_CHAT_ID = os.environ.get('TG_ORDERS_CHAT_ID', '-1002296462284')
ORDERS_TOPIC_ID = os.environ.get('TG_ORDERS_TOPIC_ID', '42172')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Content-Type': 'application/json',
}

STATUS_LABELS = {
    'new': 'Новый',
    'in_work': 'Взят в работу',
    'test': 'На тестировании',
    'done': 'Готово',
}

STATUS_EMOJI = {
    'new': '🆕',
    'in_work': '🛠',
    'test': '🧪',
    'done': '✅',
}

SOURCE_LABELS = {
    'contacts': 'Форма контактов',
    'build-pc': 'Конструктор ПК',
    'site': 'Сайт',
}


def _esc(v) -> str:
    '''Экранирует HTML-спецсимволы для Telegram parse_mode=HTML.'''
    s = str(v)
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def _phone_link(phone: str) -> str:
    digits = ''.join(ch for ch in phone if ch.isdigit() or ch == '+')
    return f'<a href="tel:{digits}">{_esc(phone)}</a>' if digits else _esc(phone)


def _tg_link(tg: str) -> str:
    handle = tg.strip().lstrip('@')
    if handle and all(ch.isalnum() or ch == '_' for ch in handle):
        return f'<a href="https://t.me/{handle}">@{_esc(handle)}</a>'
    return _esc(tg)


def db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_admin(conn, token: str):
    '''Возвращает (id, username, full_name) авторизованного админа по токену либо None'''
    if not token:
        return None
    cur = conn.cursor()
    cur.execute(
        """SELECT a.id, a.username, a.full_name
           FROM admin_sessions s JOIN admins a ON a.id = s.admin_id
           WHERE s.token = %s AND s.expires_at > NOW()""",
        (token,)
    )
    row = cur.fetchone()
    cur.close()
    return row


def notify_new_order(conn, order: dict):
    if not BOT_TOKEN:
        return
    num = order.get('order_number') or '—'
    src = SOURCE_LABELS.get(order.get('source'), order.get('source') or 'Сайт')

    lines = [f"🆕 <b>Новая заявка #{_esc(num)}</b>", ""]
    if order.get('customer_name'):
        lines.append(f"👤 <b>{_esc(order['customer_name'])}</b>")
    if order.get('customer_phone'):
        lines.append(f"📞 {_phone_link(order['customer_phone'])}")
    if order.get('customer_telegram'):
        lines.append(f"✈️ {_tg_link(order['customer_telegram'])}")
    if order.get('contact_method'):
        if order['contact_method'] == 'call':
            lines.append("💬 Способ связи: 📱 Звонок")
        else:
            lines.append("💬 Способ связи: ✉️ Сообщение")
    if order.get('comment'):
        lines.append(f"📝 {_esc(order['comment'])}")

    details = order.get('details')
    if details:
        try:
            d = details if isinstance(details, dict) else json.loads(details)
            rows = [f"   • {_esc(k)}: {_esc(v)}" for k, v in d.items() if v]
            if rows:
                lines.append("")
                lines.append("⚙️ <b>Детали сборки:</b>")
                lines.extend(rows)
        except Exception:
            pass

    lines.append("")
    lines.append(f"📍 Источник: {_esc(src)}")
    _send_to_topic("\n".join(lines))


def notify_status(conn, order: dict, status: str, admin_name: str):
    if not BOT_TOKEN:
        return
    emoji = STATUS_EMOJI.get(status, '🔄')
    label = STATUS_LABELS.get(status, status)
    num = order.get('order_number') or '—'

    lines = [f"{emoji} <b>Заявка #{_esc(num)}</b> — {_esc(label)}"]
    if order.get('customer_name'):
        lines.append(f"👤 {_esc(order['customer_name'])}")
    if admin_name:
        lines.append(f"👨‍🔧 Изменил: {_esc(admin_name)}")
    _send_to_topic("\n".join(lines))


def _send_to_topic(text: str):
    '''Отправляет сообщение в тему "Новый заказ с сайта" рабочего чата.'''
    if not BOT_TOKEN or not ORDERS_CHAT_ID:
        return
    payload = {'chat_id': ORDERS_CHAT_ID, 'text': text, 'parse_mode': 'HTML',
               'disable_web_page_preview': True}
    if ORDERS_TOPIC_ID:
        payload['message_thread_id'] = int(ORDERS_TOPIC_ID)
    try:
        requests.post(f'{API_URL}/sendMessage', json=payload, timeout=5)
    except Exception:
        pass


def gen_order_number(conn) -> str:
    cur = conn.cursor()
    cur.execute("SELECT COALESCE(MAX(id), 0) + 1001 FROM orders")
    n = cur.fetchone()[0]
    cur.close()
    return str(n)


def create_order(conn, body: dict) -> dict:
    order_number = (body.get('order_number') or '').strip() or gen_order_number(conn)
    details = body.get('details')
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        "INSERT INTO orders (order_number, customer_name, customer_phone, customer_telegram, "
        "contact_method, source, status, comment, details) "
        "VALUES (%s, %s, %s, %s, %s, %s, 'new', %s, %s) RETURNING *",
        (order_number, body.get('name'), body.get('phone'), body.get('telegram'),
         body.get('contact_method'), body.get('source', 'site'),
         body.get('comment'), json.dumps(details) if details else None)
    )
    order = cur.fetchone()
    cur.execute(
        "INSERT INTO order_status_history (order_id, status, changed_by) VALUES (%s, 'new', 'site')",
        (order['id'],)
    )
    conn.commit()
    cur.close()
    return order


def serialize(o: dict) -> dict:
    out = dict(o)
    for k, v in out.items():
        if isinstance(v, datetime):
            out[k] = v.isoformat()
    return out


def list_orders(conn) -> list:
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM orders ORDER BY created_at DESC LIMIT 500")
    rows = cur.fetchall()
    cur.close()
    return [serialize(dict(r)) for r in rows]


def mark_viewed(conn, order_id: int, admin_name: str) -> dict:
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        "UPDATE orders SET viewed_by = %s, viewed_at = NOW() "
        "WHERE id = %s AND viewed_by IS NULL RETURNING *",
        (admin_name, order_id)
    )
    row = cur.fetchone()
    if row is None:
        cur.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
        row = cur.fetchone()
    conn.commit()
    cur.close()
    return serialize(dict(row)) if row else None


def update_status(conn, order_id: int, status: str, admin_name: str) -> dict:
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if status == 'in_work':
        cur.execute(
            "UPDATE orders SET status = %s, taken_by = COALESCE(taken_by, %s), "
            "taken_at = COALESCE(taken_at, NOW()), updated_at = NOW() WHERE id = %s RETURNING *",
            (status, admin_name, order_id)
        )
    else:
        cur.execute(
            "UPDATE orders SET status = %s, updated_at = NOW() WHERE id = %s RETURNING *",
            (status, order_id)
        )
    order = cur.fetchone()
    if order:
        cur.execute(
            "INSERT INTO order_status_history (order_id, status, changed_by) VALUES (%s, %s, %s)",
            (order_id, status, admin_name)
        )
    conn.commit()
    cur.close()
    return serialize(dict(order)) if order else None


def handler(event: dict, context) -> dict:
    '''Заявки: приём с сайта (POST), список и управление статусами для админов (GET/PUT).'''
    method = event.get('httpMethod', 'POST')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''

    # GET — список заказов для админки (нужна авторизация)
    if method == 'GET':
        conn = db()
        try:
            admin = get_admin(conn, token)
            if not admin:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Требуется авторизация'})}
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'orders': list_orders(conn)})}
        finally:
            conn.close()

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'invalid json'})}

    # PUT — действия админа (просмотр / смена статуса)
    if method == 'PUT':
        conn = db()
        try:
            admin = get_admin(conn, token)
            if not admin:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Требуется авторизация'})}
            admin_name = admin[2] or admin[1]
            order_id = body.get('id')
            action = body.get('action')
            if not order_id:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'id required'})}

            if action == 'view':
                order = mark_viewed(conn, int(order_id), admin_name)
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'order': order})}

            if action == 'status':
                status = body.get('status')
                if status not in STATUS_LABELS:
                    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'bad status'})}
                order = update_status(conn, int(order_id), status, admin_name)
                if order:
                    notify_status(conn, order, status, admin_name)
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'order': order})}

            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'unknown action'})}
        finally:
            conn.close()

    # POST — приём новой заявки с сайта
    if not body.get('phone') and not body.get('name'):
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'name or phone required'})}

    conn = db()
    try:
        order = create_order(conn, body)
        notify_new_order(conn, dict(order))
    finally:
        conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'ok': True, 'order_number': order['order_number']})
    }