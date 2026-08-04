import Icon from '@/components/ui/icon';
import { STATUS_LABEL, type OrderHistoryItem } from '@/lib/ordersApi';
import { STATUS_ICON, STATUS_STYLE, fmtDate } from './constants';

interface Props {
  items: OrderHistoryItem[];
}

const OrderStatusHistory = ({ items }: Props) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="pt-3 mt-1 border-t border-border">
      <p className="flex items-center gap-1.5 text-muted-foreground font-display uppercase text-xs tracking-wider mb-3">
        <Icon name="History" size={14} /> История статусов
      </p>
      <div className="space-y-0">
        {items.map((h, i) => (
          <div key={i} className="flex items-start gap-3 pb-3 last:pb-0 relative">
            <div className="flex flex-col items-center shrink-0 pt-0.5">
              <span className={`w-6 h-6 flex items-center justify-center border clip-corner ${STATUS_STYLE[h.status] || 'border-border text-muted-foreground'}`}>
                <Icon name={STATUS_ICON[h.status] || 'Circle'} size={12} />
              </span>
              {i < items.length - 1 && <span className="w-px flex-1 min-h-4 bg-border mt-1" />}
            </div>
            <div className="min-w-0 pb-1">
              <p className="text-sm font-display">{STATUS_LABEL[h.status] || h.status}</p>
              <p className="text-xs text-muted-foreground">
                {h.changed_by === 'site' ? 'Заявка с сайта' : h.changed_by || '—'} · {fmtDate(h.created_at)}
              </p>
              {h.comment && (
                <p className="mt-1 text-sm bg-muted/40 border-l-2 border-primary/50 pl-2 py-1 whitespace-pre-wrap break-words">
                  {h.comment}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusHistory;
