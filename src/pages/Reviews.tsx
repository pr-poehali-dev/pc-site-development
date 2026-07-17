import { useEffect, useRef, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { reviews, truncateReview } from '@/data/content';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const aboutPhotos = [
  'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/7be32455-2ecb-4133-adaa-36c1f44dd867.jpg',
  'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/2df2174c-cdfa-4f8b-8674-a83b726dea57.jpg',
  'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/7a87440a-d15b-4a3a-a6c3-c07b0a2a22b6.jpg',
  'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/2d9774ba-7de2-44e0-9368-8c1b9b7a6258.jpg',
  'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/d3bb062b-e92e-4ae5-9698-130bd7d98b84.jpg',
  'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/4a5863d9-446d-4a85-ac69-1b66d503ffab.jpg',
  'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/800b5699-3e64-427a-bc91-2222f2f31f3a.jpg',
  'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/2a1f37ce-63d1-44a6-b646-7d4645675918.jpg',
  'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/ee48266d-d961-44ec-99a9-5c9fc158b8f4.jpg',
];

const Reviews = () => {
  const location = useLocation();
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [fading, setFading] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const showPrev = () =>
    setLightbox((i) => (i === null ? i : (i - 1 + aboutPhotos.length) % aboutPhotos.length));
  const showNext = () =>
    setLightbox((i) => (i === null ? i : (i + 1) % aboutPhotos.length));

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  useEffect(() => {
    const match = location.hash.match(/#review-(\d+)/);
    if (!match) return;
    const idx = Number(match[1]);
    const el = document.getElementById(`review-${idx}`);
    if (!el) return;
    setHighlighted(idx);
    setExpanded(idx);
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
    const fadeTimer = setTimeout(() => {
      setHighlighted(null);
      setFading(idx);
    }, 4000);
    const doneTimer = setTimeout(() => setFading(null), 6000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [location.hash]);

  return (
    <Layout>
      <section className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto animate-fade-up">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">О нас</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">
            WHITE <span className="text-primary text-glow-cyan">FRIDAY</span>
          </h2>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              Всем доброго времени суток, дорогие друзья! Ниже будет история о том, кто мы, как появились и что нами движет. Ну и краткая хронология.
            </p>
            <p>
              Для понимания дальнейшего рассказа — маленькое пояснение: весь этот проект был основан двумя людьми, супружеской парой, Анастасией и Алексеем.
            </p>

            {!aboutExpanded && (
              <button
                onClick={() => setAboutExpanded(true)}
                className="inline-flex items-center gap-1 text-primary font-display uppercase text-sm tracking-wider hover:underline"
              >
                Читать далее <Icon name="ChevronDown" size={14} />
              </button>
            )}

            <div
              className="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ gridTemplateRows: aboutExpanded ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div
                  className="space-y-5 transition-opacity duration-500"
                  style={{ opacity: aboutExpanded ? 1 : 0 }}
                >

            <div>
              <p className="font-display text-foreground tracking-wide mb-1">Март 2020 года</p>
              <p>Мы впервые познакомились с магазинами по продаже компьютеров, совершив покупку в магазине на «Авито».</p>
            </div>

            <div>
              <p className="font-display text-foreground tracking-wide mb-1">Апрель 2020 года</p>
              <p>Алексей устраивается в этот самый магазин на работу на позицию продавца-консультанта (была давняя мечта — работать в этой сфере). Получает бесценный опыт и знания в данной отрасли. Но приходит понимание того, что видение сервиса и отношение к клиенту немного не сходятся с тем, что есть на самом деле.</p>
            </div>

            <div>
              <p className="font-display text-foreground tracking-wide mb-1">Сентябрь 2020 года</p>
              <p>Принято решение начинать своё дело, и был принят первый заказ. Анастасия занималась закупкой, фотографией и ведением финансов, Алексей — сборкой и общением с клиентами. Основной принцип работы, который был принят, — дать людям человеческий и честный сервис, от людей для людей.</p>
            </div>

            <div>
              <p className="font-display text-foreground tracking-wide mb-1">Декабрь 2020 года</p>
              <p>Была получена первая ощутимая прибыль с данного проекта, которая позволила покинуть места основной работы и продолжать заниматься любимым делом.</p>
            </div>

            <div>
              <p className="font-display text-foreground tracking-wide mb-1">2021–2022 года</p>
              <p>Мы продолжаем заниматься этим проектом вдвоём, растим оборот, привлекаем клиентов своим подходом в общении и честности, а также тем, что никогда не оставляем человека в сложной ситуации в случае каких-то проблем. Также мы начинаем предлагать услугу по привозу любых комплектующих под заказ из Китая, и тогда же появляется наш{' '}
                <a href="https://t.me/White_Friday_PC" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Телеграм-канал</a>.</p>
            </div>

            <div>
              <p className="font-display text-foreground tracking-wide mb-1">2023 год</p>
              <p>Год огромных перемен и роста. Мы знакомимся и начинаем плотно дружить с командой BeGraphics. В этот же момент мы нанимаем первого нашего сотрудника — того самого бессменного старшего инженера Тимофея. Благодаря этим двум событиям мы начинаем сильно прогрессировать в технических знаниях и качестве выпускаемых из наших рук конфигураций.</p>
            </div>

            <div>
              <p className="font-display text-foreground tracking-wide mb-1">2024 год</p>
              <p>Мы совершаем большую ошибку — выходим на маркетплейсы. Спустя полтора года мы делаем подсчёт юнит-экономики и понимаем, что продавать качественные компьютеры на маркетах — дело неблагодарное и что мы в минусе. А делать компьютеры так, как делают остальные на этом рынке маркетплейсов, мы не можем себе позволить из-за своих принципов.</p>
            </div>

            <div>
              <p className="font-display text-foreground tracking-wide mb-1">2025 год</p>
              <p>Мы перестаём быть квартирником и наконец-то открываем свой первый офис — в том же самом районе, с которого всё начиналось и зарождалось: Москва, метро «Коломенская». Мы уходим со всех маркетплейсов. Начинаем вести свой YouTube-канал. Расширяем свой штат: происходит текучка кадров, с теми людьми, кто не поддерживает основные наши принципы — честность, открытость, качество, — нам приходится прощаться. В итоге формируется качественный костяк нашей команды — идейные и открытые ребята.</p>
            </div>

            <div>
              <p className="font-display text-foreground tracking-wide mb-1">2026 год</p>
              <p>Самый тяжёлый год для нас и нашего проекта. Мы остались на плаву только благодаря нашему окружению — нашим клиентам, которые когда-то делали у нас заказ и рекомендовали нас своим друзьям и коллегам. Именно тогда мы действительно поняли, что самая лучшая реклама — сарафанное радио. Открываем точки самовывоза в Санкт-Петербурге и Краснодаре. И наконец-то создаём этот самый сайт, на котором вы сейчас всё это читаете.</p>
            </div>

                  <p>На этом краткое повествование о нас, думаю, можно закончить! =)</p>

                  <button
                    onClick={() => setAboutExpanded(false)}
                    className="inline-flex items-center gap-1 text-primary font-display uppercase text-sm tracking-wider hover:underline"
                  >
                    Свернуть <Icon name="ChevronUp" size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 md:mt-14">
            <Carousel
              opts={{ loop: true }}
              plugins={[autoplay.current]}
              onMouseEnter={() => autoplay.current.stop()}
              onMouseLeave={() => autoplay.current.play()}
              className="w-full"
            >
              <CarouselContent>
                {aboutPhotos.map((src, i) => (
                  <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                    <div
                      className="overflow-hidden clip-corner border border-border md:cursor-zoom-in"
                      onClick={() => window.innerWidth >= 768 && setLightbox(i)}
                    >
                      <img
                        src={src}
                        alt={`White Friday — фото ${i + 1}`}
                        loading="lazy"
                        className="w-full aspect-[4/3] object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </section>

      <section className="grid-bg border-y border-border">
        <div className="container py-12 md:py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Отзывы</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold">НАМ <span className="text-primary text-glow-cyan">ДОВЕРЯЮТ</span></h1>
          <p className="text-muted-foreground mt-4 max-w-3xl mx-auto leading-relaxed">
            Нам доверяют и верят потому что мы не оставляем своих клиентов в затруднительной ситуации и всегда пытаемся прийти на помощь. Весь наш проект изначально строился на том, чтобы предоставить по-настоящему человеческий сервис, где будет тёплое и дружелюбное общение, грамотный подбор железа, а также, конечно же, педантичная и дотошная сборка и настройка всего компьютера в целом.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              id={`review-${i}`}
              className={`flex flex-col p-6 md:p-8 bg-card border clip-corner animate-fade-up scroll-mt-28 ${
                highlighted === i
                  ? 'review-neon-glow'
                  : fading === i
                    ? 'review-neon-fade'
                    : 'border-border'
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
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
                const isExpanded = expanded === i || highlighted === i;
                return (
                  <div className="mb-6">
                    <div
                      className="grid transition-[grid-template-rows] duration-500 ease-in-out"
                      style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
                    >
                      <p className="overflow-hidden text-foreground font-sans">«{r.text}»</p>
                    </div>
                    {!isExpanded && (
                      <p className="text-foreground font-sans">«{truncated ? text : r.text}»</p>
                    )}
                    {truncated && (
                      <button
                        onClick={() => setExpanded(isExpanded ? null : i)}
                        className="mt-1 inline-flex items-center gap-1 text-primary font-display uppercase text-xs tracking-wider hover:underline whitespace-nowrap"
                      >
                        {isExpanded ? 'Свернуть' : 'Читать далее'}
                        <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={12} />
                      </button>
                    )}
                  </div>
                );
              })()}

              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 flex items-center justify-center bg-secondary/20 text-secondary font-display font-bold clip-corner shrink-0">
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

        <div className="mt-12 md:mt-16 p-6 md:p-10 bg-card border border-border clip-corner flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-up">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary clip-corner shrink-0">
              <Icon name="MapPin" size={24} />
            </div>
            <div>
              <h3 className="font-display text-xl md:text-2xl uppercase tracking-wide">Больше отзывов</h3>
              <p className="text-muted-foreground text-sm">Реальные оценки наших клиентов на Яндекс.Картах</p>
            </div>
          </div>
          <a
            href="https://yandex.ru/maps/org/white_friday_pc/86872558553/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green shrink-0"
          >
            Читать на Яндекс.Картах <Icon name="ExternalLink" size={18} />
          </a>
        </div>

        <div className="mt-6 p-6 md:p-10 bg-secondary/5 border border-secondary/40 clip-corner flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-up">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 flex items-center justify-center bg-secondary/10 text-secondary clip-corner shrink-0">
              <Icon name="Star" size={24} />
            </div>
            <div>
              <h3 className="font-display text-xl md:text-2xl uppercase tracking-wide">Оставьте свой отзыв</h3>
              <p className="text-muted-foreground text-sm">Уже собрали у нас ПК? Поделитесь впечатлениями на Яндекс.Картах</p>
            </div>
          </div>
          <a
            href="https://yandex.ru/maps/org/white_friday_pc/86872558553/reviews/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner shrink-0"
          >
            Оставить отзыв <Icon name="PenLine" size={18} />
          </a>
        </div>
      </section>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] hidden md:flex items-center justify-center bg-black/90 backdrop-blur-sm p-8 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center bg-card/80 border border-border text-foreground hover:text-primary clip-corner transition-colors"
            aria-label="Закрыть"
          >
            <Icon name="X" size={22} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-card/80 border border-border text-foreground hover:text-primary clip-corner transition-colors"
            aria-label="Предыдущее фото"
          >
            <Icon name="ChevronLeft" size={26} />
          </button>

          <img
            key={lightbox}
            src={aboutPhotos[lightbox]}
            alt="White Friday — фото"
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[90vh] object-contain clip-corner animate-fade-in"
          />

          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-card/80 border border-border text-foreground hover:text-primary clip-corner transition-colors"
            aria-label="Следующее фото"
          >
            <Icon name="ChevronRight" size={26} />
          </button>

          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground text-sm font-display tracking-widest">
            {lightbox + 1} / {aboutPhotos.length}
          </span>
        </div>
      )}
    </Layout>
  );
};

export default Reviews;