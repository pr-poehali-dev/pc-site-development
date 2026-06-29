import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { builds } from '@/data/builds';

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const specRows: { key: keyof typeof builds[0]['specs']; label: string; icon: string }[] = [
  { key: 'cpu', label: 'Процессор', icon: 'Cpu' },
  { key: 'gpu', label: 'Видеокарта', icon: 'MonitorPlay' },
  { key: 'ram', label: 'Оперативная память', icon: 'MemoryStick' },
  { key: 'storage', label: 'Накопитель', icon: 'HardDrive' },
  { key: 'cooling', label: 'Охлаждение', icon: 'Fan' },
  { key: 'psu', label: 'Блок питания', icon: 'Plug' },
];

const Compare = () => {
  const [selected, setSelected] = useState<number[]>(builds.map((b) => b.id));

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const active = builds.filter((b) => selected.includes(b.id));

  return (
    <Layout>
      <section className="grid-bg border-b border-border">
        <div className="container py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Сравнение</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold">СРАВНИ <span className="text-primary text-glow-cyan">МОДЕЛИ</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Выбери сборки и сравни их характеристики бок о бок.
          </p>
        </div>
      </section>

      <section className="container py-12">
        {/* Селектор моделей */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {builds.map((b) => {
            const on = selected.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => toggle(b.id)}
                className={`flex items-center gap-2 px-5 py-2.5 font-display uppercase text-sm tracking-wider clip-corner transition-all border ${
                  on
                    ? 'bg-primary text-primary-foreground border-primary border-glow-cyan'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                }`}
              >
                <Icon name={on ? 'CheckCircle2' : 'Circle'} size={16} />
                {b.name}
              </button>
            );
          })}
        </div>

        {active.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="MousePointerClick" size={48} className="mx-auto mb-4 text-primary" />
            Выберите хотя бы одну сборку для сравнения
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-4 align-bottom w-48"></th>
                  {active.map((b) => (
                    <th key={b.id} className="p-4 text-center align-bottom">
                      <img src={b.image} alt={b.name} className="w-full h-32 object-cover clip-corner border border-border mb-3" />
                      <span className={`font-display text-xl font-bold ${b.accent === 'cyan' ? 'text-primary' : 'text-secondary'}`}>
                        {b.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-4 font-display uppercase text-sm tracking-wide text-muted-foreground flex items-center gap-2">
                    <Icon name="Banknote" size={16} className="text-primary" /> Цена
                  </td>
                  {active.map((b) => (
                    <td key={b.id} className="p-4 text-center font-display text-xl font-bold">{fmt(b.price)}</td>
                  ))}
                </tr>
                <tr className="border-t border-border bg-card/40">
                  <td className="p-4 font-display uppercase text-sm tracking-wide text-muted-foreground flex items-center gap-2">
                    <Icon name="Gauge" size={16} className="text-primary" /> Производительность
                  </td>
                  {active.map((b) => (
                    <td key={b.id} className="p-4 text-center">
                      <span className="px-3 py-1 bg-primary/10 text-primary font-display border border-primary/30">{b.fps}+ FPS</span>
                    </td>
                  ))}
                </tr>
                {specRows.map((row, ri) => (
                  <tr key={row.key} className={`border-t border-border ${ri % 2 === 1 ? 'bg-card/40' : ''}`}>
                    <td className="p-4 font-display uppercase text-sm tracking-wide text-muted-foreground flex items-center gap-2">
                      <Icon name={row.icon} size={16} className="text-primary" /> {row.label}
                    </td>
                    {active.map((b) => (
                      <td key={b.id} className="p-4 text-center text-foreground">{b.specs[row.key]}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-border">
                  <td className="p-4"></td>
                  {active.map((b) => (
                    <td key={b.id} className="p-4 text-center">
                      <button className="px-5 py-2.5 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity">
                        В корзину
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Compare;
