import type { ApiOrder, OrderStatus } from '@/lib/ordersApi';

export const STATUS_STYLE: Record<OrderStatus, string> = {
  new: 'bg-primary/15 text-primary border-primary/40',
  in_work: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
  test: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
  done: 'bg-green-600/15 text-green-500 border-green-600/40',
  waiting: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
  procurement: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/40',
  assembling: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40',
  delivering: 'bg-sky-500/15 text-sky-400 border-sky-500/40',
  rejected: 'bg-red-600/15 text-red-500 border-red-600/40',
  duplicate: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/40',
};

export const STATUS_ICON: Record<OrderStatus, string> = {
  new: 'Sparkles',
  in_work: 'Wrench',
  test: 'FlaskConical',
  done: 'CircleCheck',
  waiting: 'Clock',
  procurement: 'ShoppingCart',
  assembling: 'Cpu',
  delivering: 'Truck',
  rejected: 'CircleX',
  duplicate: 'Copy',
};

export const SOURCE_LABEL: Record<string, string> = {
  contacts: 'Форма контактов',
  'build-pc': 'Конструктор ПК',
  site: 'Сайт',
  test: 'Тест',
};

export const DETAIL_LABELS: Record<string, string> = {
  purposes: 'Задачи',
  budget: 'Бюджет',
  preferences: 'Пожелания по железу',
  wireless: 'Wi-Fi / Bluetooth',
  upgrade: 'Апгрейд',
  pcSize: 'Размер ПК',
  appearance: 'Корпус',
  lighting: 'Подсветка',
  color: 'Цвет',
};

export const fmtDate = (s: string | null) =>
  s ? new Date(s).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

export const STALE_DAYS = 3;
export const FINAL_STATUSES: OrderStatus[] = ['done', 'rejected', 'duplicate'];

export const daysStale = (o: ApiOrder): number => {
  if (FINAL_STATUSES.includes(o.status)) return 0;
  const last = new Date(o.updated_at || o.created_at).getTime();
  if (!last) return 0;
  const days = Math.floor((Date.now() - last) / 86400000);
  return days >= STALE_DAYS ? days : 0;
};

export const pluralDays = (n: number) =>
  n % 10 === 1 && n % 100 !== 11 ? 'день' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'дня' : 'дней';

export const SUB_TABS: { key: OrderStatus; label: string }[] = [
  { key: 'new', label: 'Новый заказ' },
  { key: 'test', label: 'Тест' },
  { key: 'waiting', label: 'Ожидание решения' },
  { key: 'in_work', label: 'В работе' },
  { key: 'procurement', label: 'В закупке' },
  { key: 'assembling', label: 'В сборке' },
  { key: 'delivering', label: 'В доставке' },
  { key: 'done', label: 'Готов' },
  { key: 'rejected', label: 'Отказ' },
  { key: 'duplicate', label: 'Дубли' },
];

export const ACTION_STATUSES: OrderStatus[] = [
  'test',
  'waiting',
  'in_work',
  'procurement',
  'assembling',
  'delivering',
  'done',
  'rejected',
];
