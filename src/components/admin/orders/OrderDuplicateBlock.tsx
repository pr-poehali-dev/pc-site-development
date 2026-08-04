import Icon from '@/components/ui/icon';
import type { ApiOrder } from '@/lib/ordersApi';
import { DETAIL_LABELS, fmtDate } from './constants';

interface Props {
  order: ApiOrder;
  busy: number | null;
  dupOpen: number | null;
  dupTarget: Record<number, string>;
  setDupTarget: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  setDupOpen: (id: number | null) => void;
  orderById: (id: number | null) => ApiOrder | null;
  duplicatesOf: (id: number) => ApiOrder[];
  onOpenMain: (main: ApiOrder) => void;
  linkDuplicate: (o: ApiOrder) => void;
  unlinkDuplicate: (o: ApiOrder) => void;
}

const OrderDuplicateBlock = ({
  order: o,
  busy,
  dupOpen,
  dupTarget,
  setDupTarget,
  setDupOpen,
  orderById,
  duplicatesOf,
  onOpenMain,
  linkDuplicate,
  unlinkDuplicate,
}: Props) => {
  return (
    <>
      {/* Связь дублей */}
      {o.duplicate_of ? (
        <div className="p-3 bg-zinc-500/10 border border-zinc-500/40 clip-corner text-sm">
          <p className="flex items-center gap-1.5 font-display uppercase text-xs tracking-wider text-zinc-400 mb-2">
            <Icon name="Copy" size={14} /> Это дубль заявки
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Основной заказ:{' '}
              <button
                onClick={() => {
                  const main = orderById(o.duplicate_of);
                  if (main) {
                    onOpenMain(main);
                  }
                }}
                className="font-display text-primary hover:underline"
              >
                #{orderById(o.duplicate_of)?.order_number || o.duplicate_of}
              </button>
            </span>
            <button
              disabled={busy === o.id}
              onClick={() => unlinkDuplicate(o)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border font-display uppercase text-[11px] tracking-wider clip-corner hover:border-primary/50 transition-colors disabled:opacity-40"
            >
              <Icon name="Unlink" size={13} /> Снять пометку
            </button>
          </div>
        </div>
      ) : (
        duplicatesOf(o.id).length > 0 && (
          <div className="p-3 bg-background border border-primary/30 clip-corner text-sm space-y-3">
            <p className="flex items-center gap-1.5 font-display uppercase text-xs tracking-wider text-primary">
              <Icon name="Layers" size={14} /> Объединённые заявки ({duplicatesOf(o.id).length})
            </p>
            {duplicatesOf(o.id).map((d) => (
              <div key={d.id} className="border-l-2 border-primary/40 pl-3 space-y-1">
                <p className="font-display text-sm">
                  #{d.order_number} · {fmtDate(d.created_at)}
                </p>
                {d.comment && (
                  <p className="text-xs">
                    <span className="text-muted-foreground">Комментарий: </span>
                    {d.comment}
                  </p>
                )}
                {d.details && Object.keys(d.details).length > 0 && (
                  <div className="text-xs space-y-0.5">
                    {Object.entries(d.details).map(([k, v]) => {
                      const same = o.details ? JSON.stringify(o.details[k]) === JSON.stringify(v) : false;
                      if (!v || same) return null;
                      return (
                        <div key={k} className="flex gap-2">
                          <span className="text-muted-foreground">{DETAIL_LABELS[k] || k}:</span>
                          <span className="text-amber-400">
                            {Array.isArray(v) ? v.join(', ') : String(v)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Жёлтым отмечены отличия от основного заказа
                </p>
              </div>
            ))}
          </div>
        )
      )}

      {!o.duplicate_of && dupOpen === o.id && (
        <div className="p-3 bg-background border border-border clip-corner space-y-2">
          <label className="block font-display uppercase text-xs tracking-wider text-muted-foreground">
            Номер основного заказа
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              value={dupTarget[o.id] || ''}
              onChange={(e) => setDupTarget((m) => ({ ...m, [o.id]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && linkDuplicate(o)}
              placeholder="Например: 1043"
              className="flex-1 min-w-[160px] bg-card border border-border px-3 py-2 clip-corner text-sm focus:border-primary focus:outline-none"
            />
            <button
              disabled={busy === o.id}
              onClick={() => linkDuplicate(o)}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-display uppercase text-xs tracking-wider clip-corner hover:opacity-90 disabled:opacity-40"
            >
              <Icon name="Link" size={14} /> Связать
            </button>
            <button
              onClick={() => setDupOpen(null)}
              className="px-4 py-2 border border-border font-display uppercase text-xs tracking-wider clip-corner hover:border-primary/50"
            >
              Отмена
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Заявка станет дублем указанного заказа. Её данные будут показаны в основном заказе.
          </p>
        </div>
      )}
    </>
  );
};

export default OrderDuplicateBlock;