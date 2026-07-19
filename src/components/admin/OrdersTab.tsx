import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  fetchOrders,
  markOrderViewed,
  setOrderStatus,
  STATUS_LABEL,
  type ApiOrder,
  type OrderStatus,
} from '@/lib/ordersApi';

const STATUS_STYLE: Record<OrderStatus, string> = {
  new: 'bg-primary/15 text-primary border-primary/40',
  in_work: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
  test: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
  done: 'bg-green-600/15 text-green-500 border-green-600/40',
};

const SOURCE_LABEL: Record<string, string> = {
  contacts: 'Форма контактов',
  'build-pc': 'Конструктор ПК',
  site: 'Сайт',
  test: 'Тест',
};

const DETAIL_LABELS: Record<string, string> = {
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

const fmtDate = (s: string | null) =>
  s ? new Date(s).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

const OrdersTab = ({ onToast }: { onToast: (msg: string) => void }) => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [filter, setFilter] = useState<OrderStatus>('new');

  const load = async () => {
    try {
      setOrders(await fetchOrders());
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const patch = (o: ApiOrder | null) => {
    if (!o) return;
    setOrders((list) => list.map((x) => (x.id === o.id ? o : x)));
  };

  const openCard = async (o: ApiOrder) => {
    const next = expanded === o.id ? null : o.id;
    setExpanded(next);
    if (next !== null && !o.viewed_by) {
      try {
        patch(await markOrderViewed(o.id));
      } catch {
        /* ignore */
      }
    }
  };

  const changeStatus = async (o: ApiOrder, status: OrderStatus) => {
    setBusy(o.id);
    try {
      patch(await setOrderStatus(o.id, status));
      onToast(`Статус заявки #${o.order_number}: ${STATUS_LABEL[status]}`);
    } catch (e) {
      onToast(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(null);
    }
  };

  const countBy = (st: OrderStatus) => orders.filter((o) => o.status === st).length;
  const visible = orders.filter((o) => o.status === filter);
  const SUB_TABS: { key: OrderStatus; label: string }[] = [
    { key: 'new', label: 'Новый заказ' },
    { key: 'test', label: 'Тест' },
    { key: 'in_work', label: 'В работе' },
    { key: 'done', label: 'Готов' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Icon name="Loader" size={28} className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Заказы ({orders.length})</h2>
          <p className="text-muted-foreground text-sm">
            Заявки с сайта. Новых: <span className="text-primary">{countBy('new')}</span>
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-5 py-3 border border-border text-foreground font-display uppercase text-xs tracking-wider clip-corner hover:border-primary/50 transition-colors"
        >
          <Icon name="RotateCw" size={16} /> Обновить
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {SUB_TABS.map((t) => {
          const active = filter === t.key;
          const cnt = countBy(t.key);
          return (
            <button
              key={t.key}
              onClick={() => { setFilter(t.key); setExpanded(null); }}
              className={`flex items-center gap-2 px-4 py-2 border clip-corner font-display uppercase text-xs tracking-wider transition-colors ${
                active ? STATUS_STYLE[t.key] : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              }`}
            >
              {t.label}
              <span className={`min-w-5 px-1.5 py-0.5 rounded text-[11px] leading-none ${active ? 'bg-background/40' : 'bg-muted text-muted-foreground'}`}>
                {cnt}
              </span>
            </button>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-card border border-border clip-corner">
          <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Заявок пока нет. Как только клиент оставит заявку — она появится здесь.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="p-12 text-center bg-card border border-border clip-corner">
          <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">В этой категории заявок нет.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => {
            const isOpen = expanded === o.id;
            return (
              <div
                key={o.id}
                className={`bg-card border clip-corner transition-colors ${
                  o.status === 'new' ? 'border-primary/40' : 'border-border'
                }`}
              >
                <button
                  onClick={() => openCard(o)}
                  className="w-full flex flex-col sm:flex-row sm:items-center gap-3 p-4 text-left"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`px-2.5 py-1 border clip-corner font-display uppercase text-[11px] tracking-wider shrink-0 ${STATUS_STYLE[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-lg font-bold">#{o.order_number}</span>
                        <span className="text-foreground truncate">{o.customer_name || 'Без имени'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        {o.customer_phone && <span className="flex items-center gap-1"><Icon name="Phone" size={12} /> {o.customer_phone}</span>}
                        <span>{SOURCE_LABEL[o.source || 'site'] || o.source}</span>
                        <span className="flex items-center gap-1"><Icon name="Clock" size={12} /> {fmtDate(o.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {o.taken_by && (
                      <span className="hidden md:flex items-center gap-1 text-xs text-amber-400" title={`Взял: ${o.taken_by}`}>
                        <Icon name="UserCheck" size={13} /> {o.taken_by}
                      </span>
                    )}
                    <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={18} className="text-muted-foreground" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-border/60 pt-4 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      {o.customer_telegram && (
                        <div className="flex gap-2"><span className="text-muted-foreground">Telegram:</span> {o.customer_telegram}</div>
                      )}
                      {o.contact_method && (
                        <div className="flex gap-2"><span className="text-muted-foreground">Способ связи:</span> {o.contact_method === 'call' ? 'Звонок' : 'Сообщение'}</div>
                      )}
                      {o.comment && (
                        <div className="sm:col-span-2 flex gap-2"><span className="text-muted-foreground">Комментарий:</span> {o.comment}</div>
                      )}
                    </div>

                    {o.details && Object.keys(o.details).length > 0 && (
                      <div className="p-3 bg-background border border-border clip-corner space-y-1.5 text-sm">
                        <p className="font-display uppercase text-xs tracking-wider text-muted-foreground mb-2">Детали конфигурации</p>
                        {Object.entries(o.details).map(([k, v]) =>
                          v ? (
                            <div key={k} className="flex gap-2">
                              <span className="text-muted-foreground">{DETAIL_LABELS[k] || k}:</span>
                              <span>{Array.isArray(v) ? v.join(', ') : String(v)}</span>
                            </div>
                          ) : null,
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Eye" size={13} />
                        {o.viewed_by ? `Просмотрел: ${o.viewed_by} · ${fmtDate(o.viewed_at)}` : 'Ещё не просмотрен'}
                      </span>
                      {o.taken_by && (
                        <span className="flex items-center gap-1">
                          <Icon name="UserCheck" size={13} />
                          Взял в работу: {o.taken_by} · {fmtDate(o.taken_at)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {(['in_work', 'test', 'done'] as OrderStatus[]).map((st) => (
                        <button
                          key={st}
                          disabled={busy === o.id || o.status === st}
                          onClick={() => changeStatus(o, st)}
                          className={`flex items-center gap-1.5 px-4 py-2 border font-display uppercase text-xs tracking-wider clip-corner transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            o.status === st ? STATUS_STYLE[st] : 'border-border text-foreground hover:border-primary/50'
                          }`}
                        >
                          <Icon name={st === 'in_work' ? 'Wrench' : st === 'test' ? 'FlaskConical' : 'CircleCheck'} size={14} />
                          {st === 'in_work' ? 'Взять в работу' : st === 'test' ? 'Тест' : 'Готово'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default OrdersTab;