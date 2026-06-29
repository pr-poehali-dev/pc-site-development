import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import { builds } from '@/data/builds';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const features = [
  { icon: 'Wrench', title: 'Ручная сборка', text: 'Каждый ПК собирают инженеры с опытом 10+ лет' },
  { icon: 'Zap', title: 'Тест 48 часов', text: 'Прогоняем стресс-тесты перед отправкой' },
  { icon: 'Truck', title: 'Доставка по РФ', text: 'Бережная упаковка и страховка груза' },
];

const reviews = [
  { name: 'Алексей М.', role: 'Стример', text: 'NEON PRO тянет всё на ультрах и в стрим одновременно. Зверь!', rating: 5 },
  { name: 'Дарья К.', role: 'Дизайнер 3D', text: 'TITAN X рендерит сцены в 3 раза быстрее старого ПК. Окупился.', rating: 5 },
  { name: 'Игорь В.', role: 'Геймер', text: 'Собрали за день, всё работает идеально. Подсветка просто космос.', rating: 5 },
];

const warranties = [
  { icon: 'ShieldCheck', title: '3 года гарантии', text: 'Полное покрытие всех комплектующих' },
  { icon: 'RefreshCw', title: 'Замена за 24ч', text: 'Привезём подменный ПК на время ремонта' },
  { icon: 'Headphones', title: 'Поддержка 24/7', text: 'Живые инженеры на связи круглосуточно' },
];

const faq = [
  { q: 'Можно ли изменить комплектацию сборки?', a: 'Да, любую сборку можно кастомизировать под ваши задачи и бюджет. Напишите нам — подберём оптимальный вариант.' },
  { q: 'Сколько занимает сборка и доставка?', a: 'Сборка и тестирование — 1-2 дня. Доставка по Москве — на следующий день, по России — 2-7 дней.' },
  { q: 'Есть ли рассрочка?', a: 'Да, доступна рассрочка 0% до 24 месяцев от банков-партнёров.' },
  { q: 'Что входит в гарантию?', a: 'Полное покрытие всех комплектующих 3 года, бесплатная диагностика и подменный ПК на время ремонта.' },
];

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const Index = () => {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative grid-bg overflow-hidden">
        <div className="container py-24 md:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/40 text-primary text-sm font-display uppercase tracking-widest mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
              Новое поколение 2026
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-none mb-6">
              СОБЕРИ СВОЮ <span className="text-primary text-glow-cyan">МАШИНУ</span> <br />
              <span className="text-secondary text-glow-magenta">МЕЧТЫ</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Игровые и рабочие станции с неоновой душой. Максимальная мощность, киберпанк-эстетика и гарантия 3 года.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-display uppercase tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan">
                Смотреть сборки <Icon name="ArrowRight" size={18} />
              </Link>
              <Link to="/compare" className="flex items-center gap-2 px-7 py-3.5 border border-secondary text-secondary font-display uppercase tracking-wider clip-corner hover:bg-secondary/10 transition-colors">
                <Icon name="GitCompare" size={18} /> Сравнить
              </Link>
            </div>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl" />
            <img
              src={builds[1].image}
              alt="Игровой компьютер NEONRIG"
              className="relative w-full clip-corner border border-primary/30 border-glow-cyan"
            />
          </div>
        </div>
      </section>

      {/* О НАС */}
      <section className="container py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-card border border-border clip-corner hover:border-primary/40 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary clip-corner mb-4">
                <Icon name={f.icon} size={24} />
              </div>
              <h3 className="font-display text-xl uppercase tracking-wide mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* НАШИ СБОРКИ */}
      <section className="container py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Наши сборки</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">ВЫБЕРИ СВОЙ <span className="text-primary text-glow-cyan">RIG</span></h2>
          </div>
          <Link to="/catalog" className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all font-display uppercase tracking-wider">
            Все сборки <Icon name="ArrowRight" size={18} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {builds.map((b, i) => (
            <div key={b.id} className="group bg-card border border-border clip-corner overflow-hidden hover:border-primary/50 transition-all animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="relative overflow-hidden">
                <img src={b.image} alt={b.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
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
                </ul>
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-bold">{fmt(b.price)}</span>
                  <button className="px-4 py-2 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity">
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Отзывы</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">НАМ <span className="text-secondary text-glow-magenta">ДОВЕРЯЮТ</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-8 bg-card border border-border clip-corner animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Icon key={j} name="Star" size={16} className="text-primary fill-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6">«{r.text}»</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-secondary/20 text-secondary font-display font-bold clip-corner">
                  {r.name[0]}
                </div>
                <div>
                  <p className="font-display tracking-wide">{r.name}</p>
                  <p className="text-muted-foreground text-sm">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ГАРАНТИЯ */}
      <section className="py-20 grid-bg border-y border-border">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-primary font-display uppercase tracking-widest text-sm mb-2">Гарантия</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">СПОКОЙСТВИЕ <span className="text-primary text-glow-cyan">В КОМПЛЕКТЕ</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {warranties.map((w, i) => (
              <div key={i} className="p-8 text-center bg-card/60 backdrop-blur border border-border clip-corner animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 mx-auto flex items-center justify-center bg-primary text-primary-foreground clip-corner mb-4 border-glow-cyan">
                  <Icon name={w.icon} size={28} />
                </div>
                <h3 className="font-display text-xl uppercase tracking-wide mb-2">{w.title}</h3>
                <p className="text-muted-foreground">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-20 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">FAQ</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">ЧАСТЫЕ <span className="text-secondary text-glow-magenta">ВОПРОСЫ</span></h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border clip-corner px-6">
              <AccordionTrigger className="font-display uppercase tracking-wide text-left hover:text-primary hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="relative p-12 md:p-16 text-center bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 clip-corner overflow-hidden">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">ГОТОВ К <span className="text-primary text-glow-cyan">АПГРЕЙДУ?</span></h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Подберём идеальную сборку под твои задачи и бюджет за 5 минут.</p>
          <Link to="/contacts" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground font-display uppercase tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-magenta">
            Получить консультацию <Icon name="MessageCircle" size={18} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
