import json
import os
import urllib.request
import urllib.parse
from datetime import datetime

import psycopg2
import psycopg2.extras

BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
ADMIN_PASSWORD = os.environ.get('BOT_ADMIN_PASSWORD', '')
API_URL = f'https://api.telegram.org/bot{BOT_TOKEN}'

STATUS_LABELS = {
    'new': 'Новый',
    'purchasing': 'В закупке',
    'assembling': 'В сборке',
    'testing': 'Тестирование',
    'ready': 'Готов',
    'shipped': 'Отправлен',
    'delivered': 'Доставлен',
    'done': 'Выдан',
}


def db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def tg_call(method: str, payload: dict) -> dict:
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        f'{API_URL}/{method}', data=data,
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return {'ok': False, 'error': str(e)}


def send(chat_id: int, text: str, keyboard=None, parse_mode='HTML'):
    payload = {'chat_id': chat_id, 'text': text, 'parse_mode': parse_mode}
    if keyboard is not None:
        payload['reply_markup'] = keyboard
    return tg_call('sendMessage', payload)


def send_photo(chat_id: int, photo_url: str, caption: str = ''):
    return tg_call('sendPhoto', {'chat_id': chat_id, 'photo': photo_url, 'caption': caption})


def answer_callback(callback_id: str, text: str = ''):
    return tg_call('answerCallbackQuery', {'callback_query_id': callback_id, 'text': text})


def status_label(code: str) -> str:
    return STATUS_LABELS.get(code, code)


def get_admin(conn, telegram_id: int):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM bot_admins WHERE telegram_id = %s", (telegram_id,))
    row = cur.fetchone()
    cur.close()
    return row


def is_approved_admin(conn, telegram_id: int) -> bool:
    a = get_admin(conn, telegram_id)
    return bool(a and a['status'] == 'approved')


def count_super_admins(conn) -> int:
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM bot_admins WHERE is_super = TRUE AND status = 'approved'")
    n = cur.fetchone()[0]
    cur.close()
    return n


def set_user_state(conn, tg_user: dict, state, state_data=None):
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO bot_users (telegram_id, username, first_name, state, state_data, updated_at) "
        "VALUES (%s, %s, %s, %s, %s, NOW()) "
        "ON CONFLICT (telegram_id) DO UPDATE SET state = EXCLUDED.state, "
        "state_data = EXCLUDED.state_data, username = EXCLUDED.username, "
        "first_name = EXCLUDED.first_name, updated_at = NOW()",
        (tg_user['id'], tg_user.get('username'), tg_user.get('first_name'),
         state, json.dumps(state_data) if state_data is not None else None)
    )
    conn.commit()
    cur.close()


def get_user_state(conn, telegram_id: int):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT state, state_data FROM bot_users WHERE telegram_id = %s", (telegram_id,))
    row = cur.fetchone()
    cur.close()
    if not row:
        return None, None
    return row['state'], row['state_data']


def main_menu_kb(is_admin: bool):
    rows = [[{'text': '🔍 Отследить заказ', 'callback_data': 'track'}]]
    if is_admin:
        rows.append([{'text': '🛠 Админ-панель', 'callback_data': 'admin_panel'}])
    return {'inline_keyboard': rows}


def handle_start(conn, chat_id: int, tg_user: dict):
    set_user_state(conn, tg_user, None, None)
    admin = is_approved_admin(conn, tg_user['id'])
    text = (
        "👋 <b>Добро пожаловать!</b>\n\n"
        "Я помогу отследить статус вашего заказа, показать фото сборки и тестов, "
        "а также уведомлю о готовности.\n\n"
        "Выберите действие:"
    )
    send(chat_id, text, main_menu_kb(admin))


def handle_admin_login_password(conn, chat_id: int, tg_user: dict, text: str):
    if text.strip() != ADMIN_PASSWORD or not ADMIN_PASSWORD:
        send(chat_id, "❌ Неверный пароль. Попробуйте ещё раз или отправьте /start.")
        return
    tid = tg_user['id']
    existing = get_admin(conn, tid)
    cur = conn.cursor()
    if count_super_admins(conn) == 0:
        cur.execute(
            "INSERT INTO bot_admins (telegram_id, username, first_name, is_super, status, approved_at) "
            "VALUES (%s, %s, %s, TRUE, 'approved', NOW()) "
            "ON CONFLICT (telegram_id) DO UPDATE SET is_super = TRUE, status = 'approved', approved_at = NOW()",
            (tid, tg_user.get('username'), tg_user.get('first_name'))
        )
        conn.commit()
        cur.close()
        set_user_state(conn, tg_user, None, None)
        send(chat_id, "✅ Вы назначены <b>главным администратором</b>! Теперь вы будете получать уведомления о заказах и подтверждать новых админов.", main_menu_kb(True))
        return
    if existing and existing['status'] == 'approved':
        cur.close()
        set_user_state(conn, tg_user, None, None)
        send(chat_id, "✅ Вы уже администратор.", main_menu_kb(True))
        return
    cur.execute(
        "INSERT INTO bot_admins (telegram_id, username, first_name, status) "
        "VALUES (%s, %s, %s, 'pending') "
        "ON CONFLICT (telegram_id) DO UPDATE SET status = 'pending', username = EXCLUDED.username, first_name = EXCLUDED.first_name",
        (tid, tg_user.get('username'), tg_user.get('first_name'))
    )
    conn.commit()
    cur.close()
    set_user_state(conn, tg_user, None, None)
    send(chat_id, "⏳ Пароль верный! Заявка на доступ отправлена главному администратору. Ожидайте подтверждения.")
    notify_super_admins_new_admin(conn, tg_user)


def notify_super_admins_new_admin(conn, tg_user: dict):
    cur = conn.cursor()
    cur.execute("SELECT telegram_id FROM bot_admins WHERE is_super = TRUE AND status = 'approved'")
    supers = cur.fetchall()
    cur.close()
    uname = f"@{tg_user['username']}" if tg_user.get('username') else tg_user.get('first_name', 'Без имени')
    text = f"🔔 Новый запрос на админ-доступ:\n<b>{uname}</b> (ID: {tg_user['id']})"
    kb = {'inline_keyboard': [[
        {'text': '✅ Подтвердить', 'callback_data': f"approve_{tg_user['id']}"},
        {'text': '❌ Отклонить', 'callback_data': f"reject_{tg_user['id']}"},
    ]]}
    for (sid,) in supers:
        send(sid, text, kb)


def handle_approve(conn, actor_id: int, target_id: int, callback_id: str, chat_id: int):
    if not is_approved_admin(conn, actor_id):
        answer_callback(callback_id, "Нет прав")
        return
    actor = get_admin(conn, actor_id)
    if not actor['is_super']:
        answer_callback(callback_id, "Только главный админ подтверждает")
        return
    cur = conn.cursor()
    cur.execute("UPDATE bot_admins SET status = 'approved', approved_at = NOW() WHERE telegram_id = %s", (target_id,))
    conn.commit()
    cur.close()
    answer_callback(callback_id, "Подтверждён")
    send(chat_id, f"✅ Админ {target_id} подтверждён.")
    send(target_id, "🎉 Ваш админ-доступ подтверждён! Теперь вы получаете уведомления о заказах.", main_menu_kb(True))


def handle_reject(conn, actor_id: int, target_id: int, callback_id: str, chat_id: int):
    if not is_approved_admin(conn, actor_id):
        answer_callback(callback_id, "Нет прав")
        return
    actor = get_admin(conn, actor_id)
    if not actor['is_super']:
        answer_callback(callback_id, "Только главный админ")
        return
    cur = conn.cursor()
    cur.execute("UPDATE bot_admins SET status = 'rejected' WHERE telegram_id = %s", (target_id,))
    conn.commit()
    cur.close()
    answer_callback(callback_id, "Отклонён")
    send(chat_id, f"❌ Запрос {target_id} отклонён.")
    send(target_id, "К сожалению, в админ-доступе отказано.")


def find_order(conn, order_number: str, phone: str):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    digits = ''.join(ch for ch in phone if ch.isdigit())
    cur.execute(
        "SELECT * FROM orders WHERE order_number = %s AND regexp_replace(customer_phone, '[^0-9]', '', 'g') LIKE %s",
        (order_number.strip().lstrip('#'), '%' + digits[-10:] if len(digits) >= 10 else '%' + digits)
    )
    row = cur.fetchone()
    cur.close()
    return row


def show_order_status(conn, chat_id: int, telegram_id: int, order: dict):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT status, comment, created_at FROM order_status_history WHERE order_id = %s ORDER BY created_at", (order['id'],))
    history = cur.fetchall()
    cur.execute("SELECT photo_url, photo_type, caption FROM order_photos WHERE order_id = %s ORDER BY created_at", (order['id'],))
    photos = cur.fetchall()
    cur.close()

    text = f"📦 <b>Заказ #{order['order_number']}</b>\n"
    text += f"Статус: <b>{status_label(order['status'])}</b>\n"
    if order.get('customer_name'):
        text += f"Клиент: {order['customer_name']}\n"
    if history:
        text += "\n<b>История:</b>\n"
        for h in history:
            d = h['created_at'].strftime('%d.%m.%Y %H:%M') if h['created_at'] else ''
            text += f"• {status_label(h['status'])} — {d}\n"
    send(chat_id, text)

    build = [p for p in photos if p['photo_type'] == 'build']
    tests = [p for p in photos if p['photo_type'] == 'test']
    if build:
        send(chat_id, "🖥 Фото сборки:")
        for p in build:
            send_photo(chat_id, p['photo_url'], p.get('caption') or '')
    if tests:
        send(chat_id, "🧪 Фото тестов:")
        for p in tests:
            send_photo(chat_id, p['photo_url'], p.get('caption') or '')

    cur = conn.cursor()
    cur.execute(
        "INSERT INTO order_subscribers (order_id, telegram_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
        (order['id'], telegram_id)
    )
    cur.execute("UPDATE bot_users SET last_order_id = %s, phone = %s WHERE telegram_id = %s",
                (order['id'], order.get('customer_phone'), telegram_id))
    conn.commit()
    cur.close()


def handle_text(conn, chat_id: int, tg_user: dict, text: str):
    state, state_data = get_user_state(conn, tg_user['id'])

    if state == 'admin_password':
        handle_admin_login_password(conn, chat_id, tg_user, text)
        return

    if state == 'track_number':
        set_user_state(conn, tg_user, 'track_phone', {'order_number': text.strip()})
        send(chat_id, "Теперь введите номер телефона, указанный при заказе:")
        return

    if state == 'track_phone':
        order_number = (state_data or {}).get('order_number', '')
        order = find_order(conn, order_number, text)
        set_user_state(conn, tg_user, None, None)
        if not order:
            send(chat_id, "❌ Заказ не найден. Проверьте номер заказа и телефон и попробуйте снова через /start.")
        else:
            show_order_status(conn, chat_id, tg_user['id'], order)
        return

    send(chat_id, "Не понял команду. Отправьте /start, чтобы открыть меню.")


def handle_callback(conn, callback: dict):
    data = callback['data']
    tg_user = callback['from']
    chat_id = callback['message']['chat']['id']
    cb_id = callback['id']

    if data == 'track':
        set_user_state(conn, tg_user, 'track_number', None)
        answer_callback(cb_id)
        send(chat_id, "Введите номер вашего заказа (например 1001):")
        return

    if data == 'admin_panel':
        if is_approved_admin(conn, tg_user['id']):
            answer_callback(cb_id)
            send(chat_id, "🛠 Админ-панель активна. Вы получаете уведомления о новых заказах.\nРасширенные функции появятся позже.")
        else:
            set_user_state(conn, tg_user, 'admin_password', None)
            answer_callback(cb_id)
            send(chat_id, "🔒 Введите пароль администратора:")
        return

    if data.startswith('approve_'):
        handle_approve(conn, tg_user['id'], int(data.split('_')[1]), cb_id, chat_id)
        return

    if data.startswith('reject_'):
        handle_reject(conn, tg_user['id'], int(data.split('_')[1]), cb_id, chat_id)
        return

    answer_callback(cb_id)


def handler(event: dict, context) -> dict:
    '''Telegram-бот экосистемы заказов: админ-доступ по паролю с подтверждением, отслеживание статуса заказа клиентом, фото сборки и тестов'''
    method = event.get('httpMethod', 'POST')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}, 'body': ''}

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        action = params.get('action')
        if action == 'set_webhook':
            hook_url = params.get('url', '')
            result = tg_call('setWebhook', {'url': hook_url, 'allowed_updates': ['message', 'callback_query']})
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps(result)}
        if action == 'webhook_info':
            result = tg_call('getWebhookInfo', {})
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps(result)}
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'status': 'ok', 'bot': 'running'})}

    try:
        update = json.loads(event.get('body') or '{}')
    except Exception:
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': 'ok'}

    conn = db()
    try:
        if 'message' in update and 'text' in update['message']:
            msg = update['message']
            chat_id = msg['chat']['id']
            tg_user = msg['from']
            text = msg['text']
            if text.startswith('/start'):
                handle_start(conn, chat_id, tg_user)
            elif text.startswith('/admin'):
                set_user_state(conn, tg_user, 'admin_password', None)
                send(chat_id, "🔒 Введите пароль администратора:")
            else:
                handle_text(conn, chat_id, tg_user, text)
        elif 'callback_query' in update:
            handle_callback(conn, update['callback_query'])
    finally:
        conn.close()

    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'ok': True})}