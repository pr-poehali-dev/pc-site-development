import { useCallback, useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import { type Build } from '@/data/builds';
import { apiToBuilds } from '@/lib/buildsMap';
import { fetchBuilds } from '@/lib/buildsApi';
import BuildsCarousel from '@/components/BuildsCarousel';
import { reviews, faq, truncateReview } from '@/data/content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const warranties = [
  { icon: 'ShieldCheck', title: 'Гарантия до 10 лет', text: 'Гарантия на наши ПК от нас до 3-х лет.\nГарантия на железо до 10-и лет от производителя.' },
  { icon: 'RefreshCw', title: 'Быстрая диагностика', text: 'В 90% случаев диагностика и решение проблемы в день обращения' },
  { icon: 'Headphones', title: 'Поддержка 24/7', text: 'Живые инженеры на связи почти круглосуточно' },
];

const homeReviews = reviews.slice(0, 3);
const homeFaq = faq.slice(0, 4);

const Index = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [activeBuild, setActiveBuild] = useState(0);
  const handleBuildSelect = useCallback((i: number) => setActiveBuild(i), []);

  useEffect(() => {
    fetchBuilds()
      .then((list) => {
        setBuilds(list.length > 0 ? apiToBuilds(list) : []);
      })
      .catch(() => {});
  }, []);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative grid-bg overflow-hidden lg:min-h-screen flex items-center">
        {/* Фоновое фото сборки */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/502be915-c80c-4f45-a30e-d7b83c85f1f5.jpg"
            alt=""
            className="w-full h-full object-cover blur-[2px] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-background/30" />
        </div>
        <div className="relative container py-12 md:py-28 w-full flex flex-col gap-8 md:gap-12 lg:gap-16">
          <div className="animate-fade-up max-w-3xl">
            <h1 className="font-opensans text-4xl md:text-7xl font-bold leading-none mb-6">
              СОБЕРИ СВОЮ <span className="text-primary text-glow-cyan">МАШИНУ</span> <br />
              <span className="text-secondary text-glow-magenta">МЕЧТЫ</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Игровые и рабочие станции с характером. Максимальная мощность, строгий стиль и гарантия 3 года.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-display uppercase tracking-wider clip-corner hover:opacity-90 btn-glow-green">
                Смотреть сборки <Icon name="ArrowRight" size={18} />
              </Link>
              <Link to="/contacts" className="flex items-center gap-2 px-7 py-3.5 border border-border text-foreground font-display uppercase tracking-wider clip-corner hover:border-primary/50 transition-colors">
                <Icon name="MessageCircle" size={18} /> Консультация
              </Link>
            </div>
          </div>

          {/* Карточка с метриками — снизу */}
          <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-transparent blur-3xl pointer-events-none" />
            <div className="relative p-5 md:p-8 bg-card/40 backdrop-blur-sm border border-border clip-corner grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { value: '2400+', label: 'Собранных ПК' },
                { value: 'до 24ч', label: 'Стресс-тесты' },
                { value: 'до 10 лет', label: 'Гарантия на комплектующие' },
                { value: '24/7', label: 'Поддержка (почти =))' },
              ].map((m, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-2xl md:text-4xl font-bold text-primary mb-1 tracking-tight whitespace-nowrap">{m.value}</p>
                  <p className="text-muted-foreground text-sm uppercase tracking-wide">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ЗАКАЗЫ НАШИХ КЛИЕНТОВ */}
      <section className="relative overflow-hidden py-12">
        {/* Размытое фото активной сборки на фоне всей секции */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {builds.map((b, i) => (
            <img
              key={b.id}
              src={b.image}
              alt=""
              aria-hidden
              className={`absolute inset-0 w-full h-full object-cover blur-lg scale-105 transition-opacity duration-700 ${
                activeBuild === i ? 'opacity-80' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-background/40" />
          {/* Плавное затухание сверху и снизу для мягкого перехода */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 container">
          <div className="mb-10">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-3">ЗАКАЗЫ НАШИХ <span className="text-primary text-glow-cyan">КЛИЕНТОВ</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Выбери подходящий тебе ПК или закажи индивидуальную конфигурацию!
            </p>
          </div>
          {builds.length > 0 ? (
            <BuildsCarousel builds={builds} onSelect={handleBuildSelect} />
          ) : (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Icon name="LoaderCircle" size={28} className="animate-spin" />
            </div>
          )}
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section className="relative overflow-hidden py-12 md:py-20">
        {/* Фоновое фото сборки */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/23672f98-5867-4a0b-beaa-46a15b2c51e5.jpg"
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-background/70" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 container">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-primary font-display uppercase tracking-widest text-sm mb-2">Отзывы</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">НАМ <span className="text-secondary text-glow-magenta">ДОВЕРЯЮТ</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {homeReviews.map((r, i) => (
            <div key={i} className="flex flex-col p-8 bg-card/40 backdrop-blur-md border border-border/60 clip-corner animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Icon key={j} name="Star" size={16} className={j < r.rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'} />
                  ))}
                </div>
                {r.date && (
                  <span className="text-muted-foreground text-xs font-sans">
                    {new Date(r.date).toLocaleDateString('ru-RU')}
                  </span>
                )}
              </div>
              {r.photo && (
                <div className="overflow-hidden clip-corner border border-border mb-5">
                  <img src={r.photo} alt={`Фото от ${r.name}`} className="w-full aspect-[4/3] object-cover" />
                </div>
              )}
              {(() => {
                const { text, truncated } = truncateReview(r.text, !!r.photo);
                return (
                  <p className="text-foreground mb-6 font-sans">
                    «{text}»
                    {truncated && (
                      <Link
                        to={`/reviews#review-${i}`}
                        className="ml-1 inline-flex items-center gap-1 text-primary font-display uppercase text-xs tracking-wider hover:underline whitespace-nowrap"
                      >
                        Читать далее <Icon name="ArrowRight" size={12} />
                      </Link>
                    )}
                  </p>
                );
              })()}
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary font-display font-bold clip-corner shrink-0">
                  {r.name[0]}
                </div>
                <div>
                  <p className="font-display tracking-wide">{r.name}</p>
                  {r.role && <p className="text-muted-foreground text-sm font-sans">{r.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/reviews" className="inline-flex items-center gap-2 text-primary font-display uppercase tracking-wider hover:gap-3 transition-all">
            Все отзывы <Icon name="ArrowRight" size={16} />
          </Link>
        </div>
        </div>
      </section>

      {/* ГАРАНТИЯ */}
      <section className="py-12 md:py-20 grid-bg border-y border-border">
        <div className="container">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-primary font-display uppercase tracking-widest text-sm mb-2">Гарантия</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">СПОКОЙСТВИЕ <span className="text-primary text-glow-cyan">В КОМПЛЕКТЕ</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {warranties.map((w, i) => (
              <div key={i} className="p-6 md:p-8 text-center bg-card/60 backdrop-blur border border-border clip-corner animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 mx-auto flex items-center justify-center bg-primary text-primary-foreground clip-corner mb-4 border-glow-cyan">
                  <Icon name={w.icon} size={28} />
                </div>
                <h3 className="font-display text-xl uppercase tracking-wide whitespace-pre-line leading-snug">{w.title}</h3>
                {w.text && <p className="text-muted-foreground mt-2 whitespace-pre-line">{w.text}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-12 md:py-20 max-w-3xl">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-primary font-display uppercase tracking-widest text-sm mb-2">FAQ</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">ЧАСТЫЕ <span className="text-primary text-glow-cyan">ВОПРОСЫ</span></h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {homeFaq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border clip-corner px-6 transition-all duration-300 data-[state=open]:border-glow-green data-[state=open]:bg-card/80">
              <AccordionTrigger className="font-display uppercase tracking-wide text-left hover:text-primary hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="text-center mt-8">
          <Link to="/faq" className="inline-flex items-center gap-2 text-primary font-display uppercase tracking-wider hover:gap-3 transition-all">
            Все вопросы <Icon name="ArrowRight" size={16} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-12 md:pb-20">
        <div className="relative p-8 md:p-16 text-center bg-card border border-border clip-corner overflow-hidden grid-bg">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">ГОТОВ К <span className="text-primary text-glow-cyan">АПГРЕЙДУ?</span></h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Подберём идеальную сборку под твои задачи и бюджет за 5 минут.</p>
          <Link to="/contacts" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-display uppercase tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan">
            Получить консультацию <Icon name="MessageCircle" size={18} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;