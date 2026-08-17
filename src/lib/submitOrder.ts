import func2url from '../../backend/func2url.json';

const ORDERS_URL = func2url['orders'];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Отправляет заявку с повторными попытками.
 * Таймаут одной попытки — 40 сек, чтобы медленный ответ сервера не считался ошибкой.
 */
export async function submitOrder(payload: string, attempts = 3): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 40000);
    try {
      const res = await fetch(ORDERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) return true;
      if (res.status >= 400 && res.status < 500) return false;
    } catch {
      clearTimeout(timer);
    }
    if (i < attempts - 1) await sleep(1500 * (i + 1));
  }
  return false;
}

export default submitOrder;
