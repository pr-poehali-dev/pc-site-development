import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { reviews, truncateReview } from '@/data/content';

const Reviews = () => {
  const location = useLocation();
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [fading, setFading] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

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
    </Layout>
  );
};

export default Reviews;