import func2url from '../../backend/func2url.json';

const ORDERS_URL = func2url['orders'];
const KEY = 'tg_flush_at';
const INTERVAL = 5 * 60 * 1000;

/**
 * Тихо просит сервер дослать отложенные уведомления в Telegram.
 * Срабатывает не чаще раза в 5 минут на посетителя, ничего не показывает и не ломает страницу.
 */
export function pingTelegramQueue() {
  try {
    const last = Number(localStorage.getItem(KEY) || 0);
    if (Date.now() - last < INTERVAL) return;
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* приватный режим — просто продолжаем */
  }
  fetch(`${ORDERS_URL}?action=flush_tg`, { method: 'GET', keepalive: true }).catch(() => {});
}

export default pingTelegramQueue;
