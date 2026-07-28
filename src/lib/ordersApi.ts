import func2url from '../../backend/func2url.json';
import { getToken } from '@/lib/buildsApi';

const ORDERS_URL = func2url.orders;

export type OrderStatus =
  | 'new'
  | 'in_work'
  | 'test'
  | 'done'
  | 'waiting'
  | 'procurement'
  | 'assembling'
  | 'delivering'
  | 'rejected';

export interface ApiOrder {
  id: number;
  order_number: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_telegram: string | null;
  contact_method: string | null;
  source: string | null;
  status: OrderStatus;
  comment: string | null;
  details: Record<string, unknown> | null;
  viewed_by: string | null;
  viewed_at: string | null;
  taken_by: string | null;
  taken_at: string | null;
  created_at: string;
  updated_at: string;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'Новый',
  in_work: 'В работе',
  test: 'Тест',
  done: 'Готово',
  waiting: 'Ожидание решения',
  procurement: 'В закупке',
  assembling: 'В сборке',
  delivering: 'В доставке',
  rejected: 'Отказ',
};

export async function fetchOrders(): Promise<ApiOrder[]> {
  const res = await fetch(ORDERS_URL, {
    headers: { 'X-Auth-Token': getToken() || '' },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка загрузки заказов');
  return data.orders || [];
}

export async function markOrderViewed(id: number): Promise<ApiOrder | null> {
  const res = await fetch(ORDERS_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() || '' },
    body: JSON.stringify({ id, action: 'view' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка');
  return data.order || null;
}

export async function setOrderStatus(id: number, status: OrderStatus): Promise<ApiOrder | null> {
  const res = await fetch(ORDERS_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() || '' },
    body: JSON.stringify({ id, action: 'status', status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка изменения статуса');
  return data.order || null;
}

export interface OrderHistoryItem {
  status: OrderStatus;
  changed_by: string | null;
  created_at: string;
}

export async function fetchOrderHistory(id: number): Promise<OrderHistoryItem[]> {
  const res = await fetch(ORDERS_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() || '' },
    body: JSON.stringify({ id, action: 'history' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка загрузки истории');
  return data.history || [];
}