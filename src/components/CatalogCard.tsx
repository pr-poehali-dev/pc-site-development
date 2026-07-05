import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import GpuIcon from '@/components/ui/GpuIcon';
import type { Build } from '@/data/builds';

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const CatalogCard = ({ build: b, index }: { build: Build; index: number }) => {
  const [open, setOpen] = useState(false);

  const shortSpecs: { type: 'gpu' | 'icon'; icon?: string; value?: string }[] = [
    { type: 'icon', icon: 'Cpu', value: b.specs.cpu },
    { type: 'gpu', value: b.specs.gpu },
    { type: 'icon', icon: 'MemoryStick', value: b.specs.ram },
  ];

  const restSpecs: { type: 'gpu' | 'icon'; icon?: string; label: string; value?: string }[] = [
    { type: 'icon', icon: 'CircuitBoard', label: 'Материнская плата', value: b.specs.motherboard },
    { type: 'icon', icon: 'HardDrive', label: 'Накопитель', value: b.specs.storage },
    { type: 'icon', icon: 'Plug', label: 'Блок питания', value: b.specs.psu },
    { type: 'icon', icon: 'Fan', label: 'Охлаждение CPU', value: b.specs.cooling },
    { type: 'icon', icon: 'Wind', label: 'Вентиляторы', value: b.specs.fans },
    { type: 'icon', icon: 'Monitor', label: 'Экраны и прочее', value: b.specs.extras },
    { type: 'icon', icon: 'Box', label: 'Корпус', value: b.specs.caseModel },
  ];

  const visibleShort = shortSpecs.filter((s) => s.value && s.value !== '—' && s.value !== '');
  const visibleRest = restSpecs.filter((s) => s.value && s.value !== '—' && s.value !== '');

  return (
    <div className="group min-w-0 h-full flex flex-col bg-card border border-border clip-corner overflow-hidden hover-glow-green animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="relative overflow-hidden">
        <img src={b.image} alt={b.name} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" />
        {b.buildDate && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-background/80 backdrop-blur border border-primary/40 text-primary text-sm font-display flex items-center gap-1">
            <Icon name="Calendar" size={13} />
            {new Date(b.buildDate).toLocaleDateString('ru-RU')}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className={`font-display text-2xl font-bold mb-1 ${b.accent === 'cyan' ? 'text-primary' : 'text-secondary'}`}>{b.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 font-sans">{b.tagline}</p>

        {/* Список комплектующих: краткий + раскрываемый полный */}
        <ul className="space-y-2.5 text-sm font-sans">
          {visibleShort.map((s, i) => (
            <li key={i} className="flex items-center gap-2.5">
              {s.type === 'gpu'
                ? <GpuIcon size={20} className="text-primary" />
                : <Icon name={s.icon!} size={20} className="text-primary shrink-0" />}
              <span className="min-w-0 break-words">{s.value}</span>
            </li>
          ))}
        </ul>

        {/* Раскрываемый полный список — дополняет краткий без разрыва */}
        <div
          className="grid transition-[grid-template-rows] duration-500 ease-in-out"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <ul className="space-y-2.5 text-sm font-sans pt-2.5">
              {visibleRest.map((s, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <Icon name={s.icon!} size={20} className="text-primary shrink-0" />
                  <span className="min-w-0 break-words">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-center gap-2 mt-4 mb-4 px-4 py-2 btn-primary font-display uppercase text-xs tracking-wider clip-corner"
        >
          {open ? 'Свернуть' : 'Полный список комплектующих'}
          <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={16} />
        </button>

        <div className="flex items-center justify-between gap-3 mt-auto">
          <div>
            <span className="font-display text-2xl font-bold block">{fmt(b.price)}</span>
            <span className="text-muted-foreground text-[11px] font-sans leading-tight block max-w-[160px]">
              Стоимость указана на момент сборки данной конфигурации
            </span>
          </div>
          <Link to="/contacts" className="px-4 py-2 btn-primary font-display uppercase text-sm tracking-wider clip-corner btn-glow-green shrink-0 self-start">
            Заказать
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CatalogCard;