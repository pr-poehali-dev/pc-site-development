import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import { builds } from '@/data/builds';
import BuildsCarousel from '@/components/BuildsCarousel';
import { reviews, faq } from '@/data/content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const warranties = [
  { icon: 'ShieldCheck', title: '3 года гарантии', text: 'Полное покрытие всех комплектующих' },
  { icon: 'RefreshCw', title: 'Замена за 24ч', text: 'Привезём подменный ПК на время ремонта' },
  { icon: 'Headphones', title: 'Поддержка 24/7', text: 'Живые инженеры на связи круглосуточно' },
];

const homeReviews = reviews.slice(0, 3);
const homeFaq = faq.slice(0, 4);

const Index = () => {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative grid-bg overflow-hidden">
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
        <div className="relative container py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-none mb-6">
              СОБЕРИ СВОЮ <span className="text-primary text-glow-cyan">МАШИНУ</span> <br />
              <span className="text-secondary text-glow-magenta">МЕЧТЫ</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Игровые и рабочие станции с характером. Максимальная мощность, строгий стиль и гарантия 3 года.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-display uppercase tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan">
                Смотреть сборки <Icon name="ArrowRight" size={18} />
              </Link>
              <Link to="/contacts" className="flex items-center gap-2 px-7 py-3.5 border border-border text-foreground font-display uppercase tracking-wider clip-corner hover:border-primary/50 transition-colors">
                <Icon name="MessageCircle" size={18} /> Консультация
              </Link>
            </div>
          </div>

          {/* Правая колонка — карточка с метриками */}
          <div className="relative animate-fade-up flex flex-col gap-4" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-transparent blur-3xl pointer-events-none" />
            <div className="relative p-8 bg-card/40 backdrop-blur-sm border border-border clip-corner grid grid-cols-2 gap-6">
              {[
                { value: '500+', label: 'Собранных ПК' },
                { value: '3 года', label: 'Гарантия' },
                { value: '48ч', label: 'Стресс-тест' },
                { value: '24/7', label: 'Поддержка' },
              ].map((m, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-4xl font-bold text-primary mb-1">{m.value}</p>
                  <p className="text-muted-foreground text-sm uppercase tracking-wide">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ЗАКАЗЫ НАШИХ КЛИЕНТОВ */}
      <section className="container py-12">
        <div className="mb-10">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">ЗАКАЗЫ НАШИХ <span className="text-primary text-glow-cyan">КЛИЕНТОВ</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Выбери подходящий тебе ПК или закажи индивидуальную конфигурацию!
          </p>
        </div>
        <BuildsCarousel builds={builds} />
      </section>

      {/* ОТЗЫВЫ */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <p className="text-primary font-display uppercase tracking-widest text-sm mb-2">Отзывы</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">НАМ <span className="text-secondary text-glow-magenta">ДОВЕРЯЮТ</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {homeReviews.map((r, i) => (
            <div key={i} className="p-8 bg-card border border-border clip-corner animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Icon key={j} name="Star" size={16} className="text-primary fill-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6">«{r.text}»</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary font-display font-bold clip-corner">
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
        <div className="text-center mt-8">
          <Link to="/reviews" className="inline-flex items-center gap-2 text-primary font-display uppercase tracking-wider hover:gap-3 transition-all">
            Все отзывы <Icon name="ArrowRight" size={16} />
          </Link>
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
          <p className="text-primary font-display uppercase tracking-widest text-sm mb-2">FAQ</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">ЧАСТЫЕ <span className="text-primary text-glow-cyan">ВОПРОСЫ</span></h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {homeFaq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border clip-corner px-6">
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
      <section className="container pb-20">
        <div className="relative p-12 md:p-16 text-center bg-card border border-border clip-corner overflow-hidden grid-bg">
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