import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import type { Build } from '@/data/builds';

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const CatalogCard = ({ build: b, index }: { build: Build; index: number }) => {
  const [open, setOpen] = useState(false);

  const fullSpecs: { icon: string; label: string; value?: string }[] = [
    { icon: 'Cpu', label: 'Процессор', value: b.specs.cpu },
    { icon: 'MonitorPlay', label: 'Видеокарта', value: b.specs.gpu },
    { icon: 'CircuitBoard', label: 'Материнская плата', value: b.specs.motherboard },
    { icon: 'MemoryStick', label: 'Оперативная память', value: b.specs.ram },
    { icon: 'HardDrive', label: 'Накопитель', value: b.specs.storage },
    { icon: 'Plug', label: 'Блок питания', value: b.specs.psu },
    { icon: 'Fan', label: 'Охлаждение CPU', value: b.specs.cooling },
    { icon: 'Wind', label: 'Вентиляторы', value: b.specs.fans },
    { icon: 'Monitor', label: 'Экраны и прочее', value: b.specs.extras },
    { icon: 'Box', label: 'Корпус', value: b.specs.caseModel },
  ];

  const visible = fullSpecs.filter((s) => s.value && s.value !== '—' && s.value !== '');

  return (
    <div className="group min-w-0 bg-card border border-border clip-corner overflow-hidden hover-glow-green animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="relative overflow-hidden">
        <img src={b.image} alt={b.name} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" />
        {b.buildDate && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-background/80 backdrop-blur border border-primary/40 text-primary text-sm font-display flex items-center gap-1">
            <Icon name="Calendar" size={13} />
            {new Date(b.buildDate).toLocaleDateString('ru-RU')}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className={`font-display text-2xl font-bold mb-1 ${b.accent === 'cyan' ? 'text-primary' : 'text-secondary'}`}>{b.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 font-sans">{b.tagline}</p>

        {/* Краткий список */}
        <ul className="space-y-2 mb-4 text-sm font-sans">
          <li className="flex items-center gap-2"><Icon name="Cpu" size={14} className="text-primary shrink-0" /> <span className="min-w-0 break-words">{b.specs.cpu}</span></li>
          <li className="flex items-center gap-2"><Icon name="MonitorPlay" size={14} className="text-primary shrink-0" /> <span className="min-w-0 break-words">{b.specs.gpu}</span></li>
          <li className="flex items-center gap-2"><Icon name="MemoryStick" size={14} className="text-primary shrink-0" /> <span className="min-w-0 break-words">{b.specs.ram}</span></li>
          <li className="flex items-center gap-2"><Icon name="HardDrive" size={14} className="text-primary shrink-0" /> <span className="min-w-0 break-words">{b.specs.storage}</span></li>
        </ul>

        {/* Раскрываемый полный список */}
        <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[600px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
          <div className="pt-2 border-t border-border">
            <p className="font-display uppercase text-xs tracking-wider text-muted-foreground mb-3">Полная конфигурация</p>
            <ul className="space-y-3 text-sm font-sans">
              {visible.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Icon name={s.icon} size={14} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground text-xs block">{s.label}</span>
                    <span>{s.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-center gap-2 mb-4 px-4 py-2 border border-border text-foreground font-display uppercase text-xs tracking-wider clip-corner hover:border-primary/50 transition-colors"
        >
          {open ? 'Свернуть' : 'Полный список комплектующих'}
          <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={16} />
        </button>

        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-display text-2xl font-bold block">{fmt(b.price)}</span>
            <span className="text-muted-foreground text-[11px] font-sans leading-tight block max-w-[160px]">
              Стоимость указана на момент сборки данной конфигурации
            </span>
          </div>
          <Link to="/contacts" className="px-4 py-2 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 btn-glow-green shrink-0 self-start">
            Заказать
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CatalogCard;