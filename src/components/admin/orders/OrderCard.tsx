import Icon from '@/components/ui/icon';
import { STATUS_LABEL, type ApiOrder, type OrderHistoryItem, type OrderStatus } from '@/lib/ordersApi';
import {
  ACTION_STATUSES,
  DETAIL_LABELS,
  SOURCE_LABEL,
  STATUS_ICON,
  STATUS_STYLE,
  daysStale,
  fmtDate,
  pluralDays,
} from './constants';
import OrderDuplicateBlock from './OrderDuplicateBlock';
import OrderStatusHistory from './OrderStatusHistory';

interface Props {
  order: ApiOrder;
  isOpen: boolean;
  busy: number | null;
  note: Record<number, string>;
  setNote: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  history: Record<number, OrderHistoryItem[]>;
  dupOpen: number | null;
  dupTarget: Record<number, string>;
  setDupTarget: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  setDupOpen: (id: number | null) => void;
  orderById: (id: number | null) => ApiOrder | null;
  duplicatesOf: (id: number) => ApiOrder[];
  openCard: (o: ApiOrder) => void;
  onOpenMain: (main: ApiOrder) => void;
  changeStatus: (o: ApiOrder, status: OrderStatus) => void;
  linkDuplicate: (o: ApiOrder) => void;
  unlinkDuplicate: (o: ApiOrder) => void;
}

const OrderCard = ({
  order: o,
  isOpen,
  busy,
  note,
  setNote,
  history,
  dupOpen,
  dupTarget,
  setDupTarget,
  setDupOpen,
  orderById,
  duplicatesOf,
  openCard,
  onOpenMain,
  changeStatus,
  linkDuplicate,
  unlinkDuplicate,
}: Props) => {
  const stale = daysStale(o);

  return (
    <div
      className={`bg-card border clip-corner transition-colors ${
        stale ? 'border-red-500/60 shadow-[0_0_0_1px_rgba(239,68,68,0.35)]' : o.status === 'new' ? 'border-primary/40' : 'border-border'
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
              {stale > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/15 text-red-400 font-display uppercase text-[10px] tracking-wider">
                  <Icon name="TriangleAlert" size={12} /> Без движения {stale} {pluralDays(stale)}
                </span>
              )}
              {o.duplicate_of && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-500/15 text-zinc-400 font-display uppercase text-[10px] tracking-wider">
                  <Icon name="Copy" size={12} /> Дубль #{orderById(o.duplicate_of)?.order_number || o.duplicate_of}
                </span>
              )}
              {!o.duplicate_of && duplicatesOf(o.id).length > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-primary/15 text-primary font-display uppercase text-[10px] tracking-wider">
                  <Icon name="Layers" size={12} /> +{duplicatesOf(o.id).length} заявк{duplicatesOf(o.id).length === 1 ? 'а' : 'и'}
                </span>
              )}
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

          <div className="pt-1">
            <label className="flex items-center gap-1.5 text-muted-foreground font-display uppercase text-xs tracking-wider mb-2">
              <Icon name="MessageSquarePlus" size={14} /> Комментарий менеджера
            </label>
            <textarea
              value={note[o.id] || ''}
              onChange={(e) => setNote((m) => ({ ...m, [o.id]: e.target.value }))}
              rows={2}
              placeholder="Важная информация по заказу: причина отказа, детали закупки, договорённости с клиентом…"
              className="w-full bg-background border border-border px-3 py-2 clip-corner text-sm focus:border-primary focus:outline-none transition-colors resize-y"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Текст сохранится в историю рядом с выбранным ниже статусом.
            </p>
          </div>

          <OrderDuplicateBlock
            order={o}
            busy={busy}
            dupOpen={dupOpen}
            dupTarget={dupTarget}
            setDupTarget={setDupTarget}
            setDupOpen={setDupOpen}
            orderById={orderById}
            duplicatesOf={duplicatesOf}
            onOpenMain={onOpenMain}
            linkDuplicate={linkDuplicate}
            unlinkDuplicate={unlinkDuplicate}
          />

          <div className="flex flex-wrap gap-2 pt-1">
            {!o.duplicate_of && (
              <button
                disabled={busy === o.id}
                onClick={() => setDupOpen(dupOpen === o.id ? null : o.id)}
                className={`flex items-center gap-1.5 px-4 py-2 border font-display uppercase text-xs tracking-wider clip-corner transition-colors disabled:opacity-40 ${
                  dupOpen === o.id ? STATUS_STYLE.duplicate : 'border-border text-foreground hover:border-primary/50'
                }`}
              >
                <Icon name="Copy" size={14} /> Дубль
              </button>
            )}
            {ACTION_STATUSES.map((st) => (
              <button
                key={st}
                disabled={busy === o.id || o.status === st}
                onClick={() => changeStatus(o, st)}
                className={`flex items-center gap-1.5 px-4 py-2 border font-display uppercase text-xs tracking-wider clip-corner transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  o.status === st ? STATUS_STYLE[st] : 'border-border text-foreground hover:border-primary/50'
                }`}
              >
                <Icon name={STATUS_ICON[st]} size={14} />
                {st === 'in_work' ? 'Взять в работу' : STATUS_LABEL[st]}
              </button>
            ))}
          </div>

          <OrderStatusHistory items={history[o.id] || []} />
        </div>
      )}
    </div>
  );
};

export default OrderCard;
