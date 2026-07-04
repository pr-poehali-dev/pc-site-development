import json
import os
import urllib.request
from datetime import datetime

import psycopg2
import psycopg2.extras

BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
API_URL = f'https://api.telegram.org/bot{BOT_TOKEN}'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
}


def db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def notify_admins(conn, order: dict):
    if not BOT_TOKEN:
        return
    cur = conn.cursor()
    cur.execute("SELECT telegram_id FROM bot_admins WHERE status = 'approved'")
    admins = cur.fetchall()
    cur.close()
    if not admins:
        return
    lines = [f"🆕 <b>Новая заявка</b> с сайта"]
    if order.get('order_number'):
        lines.append(f"Заказ: #{order['order_number']}")
    if order.get('customer_name'):
        lines.append(f"Имя: {order['customer_name']}")
    if order.get('customer_phone'):
        lines.append(f"Телефон: {order['customer_phone']}")
    if order.get('customer_telegram'):
        lines.append(f"Telegram: {order['customer_telegram']}")
    if order.get('contact_method'):
        cm = 'Звонок' if order['contact_method'] == 'call' else 'Сообщение'
        lines.append(f"Способ связи: {cm}")
    if order.get('comment'):
        lines.append(f"Комментарий: {order['comment']}")
    if order.get('details'):
        try:
            d = order['details'] if isinstance(order['details'], dict) else json.loads(order['details'])
            for k, v in d.items():
                if v:
                    lines.append(f"• {k}: {v}")
        except Exception:
            pass
    text = "\n".join(lines)
    payload_base = {'text': text, 'parse_mode': 'HTML'}
    for (tid,) in admins:
        data = json.dumps({**payload_base, 'chat_id': tid}).encode('utf-8')
        req = urllib.request.Request(f'{API_URL}/sendMessage', data=data, headers={'Content-Type': 'application/json'})
        try:
            urllib.request.urlopen(req, timeout=10)
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


def handler(event: dict, context) -> dict:
    '''Приём заявок с форм сайта: создаёт заказ в БД и уведомляет админов бота в Telegram'''
    method = event.get('httpMethod', 'POST')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if method == 'GET':
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'status': 'ok'})}

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'invalid json'})}

    if not body.get('phone') and not body.get('name'):
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'name or phone required'})}

    conn = db()
    try:
        order = create_order(conn, body)
        notify_admins(conn, dict(order))
    finally:
        conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'ok': True, 'order_number': order['order_number']})
    }
