import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import { builds } from '@/data/builds';

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const Catalog = () => {
  return (
    <Layout>
      <section className="grid-bg border-b border-border">
        <div className="container py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Каталог</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold">НАШИ <span className="text-primary text-glow-cyan">СБОРКИ</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Готовые конфигурации под любые задачи — от киберспорта до 3D-рендеринга.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {builds.map((b, i) => (
            <div key={b.id} className="group bg-card border border-border clip-corner overflow-hidden hover:border-primary/50 transition-all animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="relative overflow-hidden">
                <img src={b.image} alt={b.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-background/80 backdrop-blur border border-primary/40 text-primary text-sm font-display">
                  {b.fps}+ FPS
                </div>
              </div>
              <div className="p-6">
                <h3 className={`font-display text-2xl font-bold mb-1 ${b.accent === 'cyan' ? 'text-primary' : 'text-secondary'}`}>{b.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{b.tagline}</p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2"><Icon name="Cpu" size={14} className="text-primary" /> {b.specs.cpu}</li>
                  <li className="flex items-center gap-2"><Icon name="MonitorPlay" size={14} className="text-primary" /> {b.specs.gpu}</li>
                  <li className="flex items-center gap-2"><Icon name="MemoryStick" size={14} className="text-primary" /> {b.specs.ram}</li>
                  <li className="flex items-center gap-2"><Icon name="HardDrive" size={14} className="text-primary" /> {b.specs.storage}</li>
                  <li className="flex items-center gap-2"><Icon name="Fan" size={14} className="text-primary" /> {b.specs.cooling}</li>
                </ul>
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-bold">{fmt(b.price)}</span>
                  <Link to="/contacts" className="px-4 py-2 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity">
                    Заказать
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/contacts" className="inline-flex items-center gap-2 px-7 py-3.5 border border-secondary text-secondary font-display uppercase tracking-wider clip-corner hover:bg-secondary/10 transition-colors">
            <Icon name="Wrench" size={18} /> Собрать индивидуальную конфигурацию
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;