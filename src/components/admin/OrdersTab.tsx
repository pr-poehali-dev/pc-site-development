import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  fetchOrders,
  fetchOrderHistory,
  markOrderViewed,
  setOrderStatus,
  markOrderDuplicate,
  unmarkOrderDuplicate,
  STATUS_LABEL,
  type ApiOrder,
  type OrderStatus,
  type OrderHistoryItem,
} from '@/lib/ordersApi';
import { STATUS_STYLE, SUB_TABS } from './orders/constants';
import OrderCard from './orders/OrderCard';

const OrdersTab = ({ onToast }: { onToast: (msg: string) => void }) => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [filter, setFilter] = useState<OrderStatus>('new');
  const [history, setHistory] = useState<Record<number, OrderHistoryItem[]>>({});
  const [note, setNote] = useState<Record<number, string>>({});
  const [dupOpen, setDupOpen] = useState<number | null>(null);
  const [dupTarget, setDupTarget] = useState<Record<number, string>>({});

  const loadHistory = async (id: number) => {
    try {
      const h = await fetchOrderHistory(id);
      setHistory((m) => ({ ...m, [id]: h }));
    } catch {
      /* ignore */
    }
  };

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
    if (next !== null) {
      loadHistory(o.id);
      if (!o.viewed_by) {
        try {
          patch(await markOrderViewed(o.id));
        } catch {
          /* ignore */
        }
      }
    }
  };

  const changeStatus = async (o: ApiOrder, status: OrderStatus) => {
    setBusy(o.id);
    const comment = (note[o.id] || '').trim();
    try {
      patch(await setOrderStatus(o.id, status, comment || undefined));
      onToast(`Статус заявки #${o.order_number}: ${STATUS_LABEL[status]}`);
      setNote((m) => ({ ...m, [o.id]: '' }));
      loadHistory(o.id);
    } catch (e) {
      onToast(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(null);
    }
  };

  const linkDuplicate = async (o: ApiOrder) => {
    const target = (dupTarget[o.id] || '').trim();
    if (!target) {
      onToast('Укажите номер основного заказа');
      return;
    }
    setBusy(o.id);
    try {
      patch(await markOrderDuplicate(o.id, target, (note[o.id] || '').trim() || undefined));
      onToast(`Заявка #${o.order_number} привязана к #${target.replace(/^#/, '')}`);
      setDupOpen(null);
      setDupTarget((m) => ({ ...m, [o.id]: '' }));
      setNote((m) => ({ ...m, [o.id]: '' }));
      loadHistory(o.id);
      load();
    } catch (e) {
      onToast(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(null);
    }
  };

  const unlinkDuplicate = async (o: ApiOrder) => {
    setBusy(o.id);
    try {
      patch(await unmarkOrderDuplicate(o.id));
      onToast(`С заявки #${o.order_number} снята пометка дубля`);
      loadHistory(o.id);
      load();
    } catch (e) {
      onToast(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(null);
    }
  };

  const orderById = (id: number | null) => (id ? orders.find((x) => x.id === id) || null : null);
  const duplicatesOf = (id: number) => orders.filter((x) => x.duplicate_of === id);

  const onOpenMain = (main: ApiOrder) => {
    setFilter(main.status);
    setExpanded(main.id);
    loadHistory(main.id);
  };

  const countBy = (st: OrderStatus) => orders.filter((o) => o.status === st).length;
  const visible = orders.filter((o) => o.status === filter);

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
          {visible.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              isOpen={expanded === o.id}
              busy={busy}
              note={note}
              setNote={setNote}
              history={history}
              dupOpen={dupOpen}
              dupTarget={dupTarget}
              setDupTarget={setDupTarget}
              setDupOpen={setDupOpen}
              orderById={orderById}
              duplicatesOf={duplicatesOf}
              openCard={openCard}
              onOpenMain={onOpenMain}
              changeStatus={changeStatus}
              linkDuplicate={linkDuplicate}
              unlinkDuplicate={unlinkDuplicate}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default OrdersTab;
