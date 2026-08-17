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

# Базовый адрес сайта для ссылок в уведомлениях
SITE_URL = os.environ.get('SITE_URL', 'https://wf-pc.ru')
ADMIN_ORDERS_URL = f'{SITE_URL}/yadirfetihwwork'

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
    'waiting': 'Ожидание решения',
    'procurement': 'В закупке',
    'assembling': 'В сборке',
    'delivering': 'В доставке',
    'rejected': 'Отказ',
    'duplicate': 'Дубль',
}

STATUS_EMOJI = {
    'new': '🆕',
    'in_work': '🛠',
    'test': '🧪',
    'done': '✅',
    'waiting': '⏳',
    'procurement': '🛒',
    'assembling': '⚙️',
    'delivering': '🚚',
    'rejected': '❌',
    'duplicate': '🔗',
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
    keyboard = {'inline_keyboard': [[{'text': '🔧 Открыть заявку в админке', 'url': ADMIN_ORDERS_URL}]]}
    _send_to_topic("\n".join(lines), keyboard)


def notify_status(conn, order: dict, status: str, admin_name: str, comment: str = None):
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
    if comment and comment.strip():
        lines.append(f"📝 {_esc(comment.strip())}")
    _send_to_topic("\n".join(lines))


TG_TIMEOUT = float(os.environ.get('TG_TIMEOUT', '2.5'))


def _tg_post(payload: dict):
    '''Одна быстрая попытка отправки. Возвращает (ok, error).'''
    try:
        r = requests.post(f'{API_URL}/sendMessage', json=payload, timeout=TG_TIMEOUT)
        if r.ok:
            return True, None
        return False, f'{r.status_code}: {r.text[:300]}'
    except Exception as e:
        return False, str(e)[:300]


def _outbox_add(payload: dict) -> int:
    '''Кладёт сообщение в очередь, чтобы отправить позже. Не должно ломать основной поток.'''
    try:
        conn = db()
        cur = conn.cursor()
        cur.execute("INSERT INTO tg_outbox (payload) VALUES (%s) RETURNING id", (json.dumps(payload),))
        row_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return row_id
    except Exception as e:
        print(f'[TG] outbox insert failed: {e}')
        return 0


def _outbox_done(row_id: int, error: str = None):
    if not row_id:
        return
    try:
        conn = db()
        cur = conn.cursor()
        if error is None:
            cur.execute("UPDATE tg_outbox SET sent_at = NOW(), attempts = attempts + 1 WHERE id = %s", (row_id,))
        else:
            cur.execute("UPDATE tg_outbox SET attempts = attempts + 1, last_error = %s WHERE id = %s", (error, row_id))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f'[TG] outbox update failed: {e}')


def flush_outbox(limit: int = 5):
    '''Досылает накопившиеся уведомления. Вызывается при любом обращении к функции.'''
    if not BOT_TOKEN:
        return
    try:
        conn = db()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, payload FROM tg_outbox WHERE sent_at IS NULL AND attempts < 20 "
            "ORDER BY id ASC LIMIT %s" % int(limit)
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
    except Exception as e:
        print(f'[TG] outbox read failed: {e}')
        return
    for row_id, payload in rows:
        data = payload if isinstance(payload, dict) else json.loads(payload)
        ok, err = _tg_post(data)
        _outbox_done(row_id, None if ok else err)
        if not ok:
            break


def _send_to_topic(text: str, keyboard=None):
    '''Отправляет сообщение в тему "Новый заказ с сайта". При сбое Telegram кладёт в очередь.'''
    if not BOT_TOKEN or not ORDERS_CHAT_ID:
        return
    payload = {'chat_id': ORDERS_CHAT_ID, 'text': text, 'parse_mode': 'HTML',
               'disable_web_page_preview': True}
    if keyboard is not None:
        payload['reply_markup'] = keyboard
    if ORDERS_TOPIC_ID:
        payload['message_thread_id'] = int(ORDERS_TOPIC_ID)

    row_id = _outbox_add(payload)
    ok, err = _tg_post(payload)
    if ok:
        _outbox_done(row_id)
    else:
        print(f'[TG] deferred to outbox #{row_id}: {err}')
        _outbox_done(row_id, err)


STALE_DAYS = int(os.environ.get('ORDERS_STALE_DAYS', '3'))
REMIND_KEY = os.environ.get('BOT_ADMIN_PASSWORD', '')


def _plural_days(n: int) -> str:
    if n % 10 == 1 and n % 100 != 11:
        return 'день'
    if n % 10 in (2, 3, 4) and n % 100 not in (12, 13, 14):
        return 'дня'
    return 'дней'


def list_stale_orders(conn) -> list:
    '''Активные заказы без движения дольше STALE_DAYS дней (исключая готовые и отказы).'''
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        "SELECT id, order_number, customer_name, status, taken_by, "
        "GREATEST(0, EXTRACT(DAY FROM NOW() - COALESCE(updated_at, created_at))::int) AS days "
        "FROM orders "
        "WHERE status NOT IN ('done', 'rejected', 'duplicate') "
        "AND COALESCE(updated_at, created_at) < NOW() - INTERVAL '%s days' "
        "ORDER BY COALESCE(updated_at, created_at) ASC" % STALE_DAYS
    )
    rows = cur.fetchall()
    cur.close()
    return [dict(r) for r in rows]


def notify_stale(conn) -> int:
    '''Формирует и отправляет в Telegram сводку зависших заказов. Возвращает их количество.'''
    stale = list_stale_orders(conn)
    if not stale:
        return 0
    lines = [f"⚠️ <b>Заказы без движения ({len(stale)})</b>",
             f"Не меняли статус дольше {STALE_DAYS} дн. — стоит проверить:", ""]
    for o in stale[:30]:
        d = int(o.get('days') or 0)
        label = STATUS_LABELS.get(o['status'], o['status'])
        name = o.get('customer_name') or 'Без имени'
        taken = f" · {_esc(o['taken_by'])}" if o.get('taken_by') else ''
        lines.append(
            f"• <b>#{_esc(o['order_number'])}</b> {_esc(name)} — {_esc(label)} "
            f"({d} {_plural_days(d)}){taken}"
        )
    if len(stale) > 30:
        lines.append(f"…и ещё {len(stale) - 30}")
    keyboard = {'inline_keyboard': [[{'text': '🔧 Открыть заявки в админке', 'url': ADMIN_ORDERS_URL}]]}
    _send_to_topic("\n".join(lines), keyboard)
    return len(stale)


def gen_order_number(conn) -> str:
    cur = conn.cursor()
    cur.execute("SELECT COALESCE(MAX(id), 0) + 1001 FROM orders")
    n = cur.fetchone()[0]
    cur.close()
    return str(n)


def find_recent_same(conn, body: dict):
    '''Ищет заявку с тем же телефоном и источником за последние 5 минут — защита от повторной отправки.'''
    phone = (body.get('phone') or '').strip()
    if not phone:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        "SELECT * FROM orders WHERE customer_phone = %s AND COALESCE(source, '') = %s "
        "AND created_at > NOW() - INTERVAL '5 minutes' ORDER BY id DESC LIMIT 1",
        (phone, body.get('source', 'site') or '')
    )
    row = cur.fetchone()
    cur.close()
    return dict(row) if row else None


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


def update_status(conn, order_id: int, status: str, admin_name: str, comment: str = None) -> dict:
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
            "INSERT INTO order_status_history (order_id, status, changed_by, comment) VALUES (%s, %s, %s, %s)",
            (order_id, status, admin_name, (comment or '').strip() or None)
        )
    conn.commit()
    cur.close()
    return serialize(dict(order)) if order else None


def mark_duplicate(conn, order_id: int, target: str, admin_name: str, comment: str = None) -> dict:
    '''Помечает заказ дублем другого. target — номер заказа (order_number) или его id.'''
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    target = (target or '').strip().lstrip('#')

    cur.execute("SELECT id, order_number FROM orders WHERE order_number = %s", (target,))
    main = cur.fetchone()
    if not main and target.isdigit():
        cur.execute("SELECT id, order_number FROM orders WHERE id = %s", (int(target),))
        main = cur.fetchone()

    if not main:
        cur.close()
        return {'error': 'Основной заказ с таким номером не найден'}
    if main['id'] == order_id:
        cur.close()
        return {'error': 'Нельзя связать заказ сам с собой'}

    # Если основной сам является дублем — привязываем к его первоисточнику
    cur.execute("SELECT duplicate_of FROM orders WHERE id = %s", (main['id'],))
    row = cur.fetchone()
    main_id = row['duplicate_of'] if row and row['duplicate_of'] else main['id']
    if main_id == order_id:
        cur.close()
        return {'error': 'Нельзя связать заказ сам с собой'}

    cur.execute(
        "UPDATE orders SET duplicate_of = %s, status = 'duplicate', updated_at = NOW() "
        "WHERE id = %s RETURNING *",
        (main_id, order_id)
    )
    order = cur.fetchone()
    if order:
        cur.execute("SELECT order_number FROM orders WHERE id = %s", (main_id,))
        mrow = cur.fetchone()
        note = f"Дубль заказа #{mrow['order_number'] if mrow else main_id}"
        if (comment or '').strip():
            note += f". {comment.strip()}"
        cur.execute(
            "INSERT INTO order_status_history (order_id, status, changed_by, comment) VALUES (%s, %s, %s, %s)",
            (order_id, 'duplicate', admin_name, note)
        )
    conn.commit()
    cur.close()
    return serialize(dict(order)) if order else None


def unmark_duplicate(conn, order_id: int, admin_name: str) -> dict:
    '''Снимает пометку дубля, возвращает заказ в статус «Новый».'''
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        "UPDATE orders SET duplicate_of = NULL, status = 'new', updated_at = NOW() "
        "WHERE id = %s RETURNING *",
        (order_id,)
    )
    order = cur.fetchone()
    if order:
        cur.execute(
            "INSERT INTO order_status_history (order_id, status, changed_by, comment) VALUES (%s, %s, %s, %s)",
            (order_id, 'new', admin_name, 'Пометка дубля снята')
        )
    conn.commit()
    cur.close()
    return serialize(dict(order)) if order else None


def list_history(conn, order_id: int) -> list:
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        "SELECT status, changed_by, comment, created_at FROM order_status_history "
        "WHERE order_id = %s ORDER BY created_at ASC, id ASC",
        (order_id,)
    )
    rows = cur.fetchall()
    cur.close()
    return [serialize(dict(r)) for r in rows]


def handler(event: dict, context) -> dict:
    '''Заявки: приём с сайта (POST), список и управление статусами для админов (GET/PUT).'''
    method = event.get('httpMethod', 'POST')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''
    params = event.get('queryStringParameters') or {}

    # GET ?action=flush_tg — досылка отложенных уведомлений (для планировщика)
    if method == 'GET' and params.get('action') == 'flush_tg':
        sent = 0
        try:
            flush_outbox(20)
            conn = db()
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) FROM tg_outbox WHERE sent_at IS NULL AND attempts < 20")
            sent = cur.fetchone()[0]
            cur.close()
            conn.close()
        except Exception as e:
            print(f'[TG] flush endpoint failed: {e}')
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'pending': sent})}

    # GET ?action=remind_stale&key=... — ежедневное напоминание о зависших заказах (для планировщика)
    if method == 'GET' and params.get('action') == 'remind_stale':
        if not REMIND_KEY or params.get('key') != REMIND_KEY:
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'forbidden'})}
        conn = db()
        try:
            count = notify_stale(conn)
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'stale': count})}
        finally:
            conn.close()

    # GET — список заказов для админки (нужна авторизация)
    if method == 'GET':
        conn = db()
        try:
            admin = get_admin(conn, token)
            if not admin:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Требуется авторизация'})}
            result = {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'orders': list_orders(conn)})}
        finally:
            conn.close()
        try:
            flush_outbox()
        except Exception as e:
            print(f'[TG] flush failed: {e}')
        return result

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

            if action == 'history':
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'history': list_history(conn, int(order_id))})}

            if action == 'status':
                status = body.get('status')
                if status not in STATUS_LABELS:
                    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'bad status'})}
                comment = body.get('comment')
                order = update_status(conn, int(order_id), status, admin_name, comment)
                if order:
                    notify_status(conn, order, status, admin_name, comment)
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'order': order})}

            if action == 'duplicate':
                target = body.get('target')
                if not target:
                    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Укажите номер основного заказа'})}
                res = mark_duplicate(conn, int(order_id), str(target), admin_name, body.get('comment'))
                if isinstance(res, dict) and res.get('error'):
                    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps(res)}
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'order': res})}

            if action == 'unduplicate':
                order = unmark_duplicate(conn, int(order_id), admin_name)
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'order': order})}

            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'unknown action'})}
        finally:
            conn.close()

    # POST — приём новой заявки с сайта
    if not body.get('phone') and not body.get('name'):
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'name or phone required'})}

    conn = db()
    try:
        existing = find_recent_same(conn, body)
        if existing:
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({'ok': True, 'order_number': existing['order_number'], 'duplicate': True})
            }
        order = create_order(conn, body)
    finally:
        conn.close()

    # Уведомление не должно влиять на успех заявки: при сбое Telegram оно уйдёт из очереди позже
    try:
        flush_outbox(2)
        notify_new_order(None, dict(order))
    except Exception as e:
        print(f'[TG] notify_new_order failed: {e}')

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'ok': True, 'order_number': order['order_number']})
    }