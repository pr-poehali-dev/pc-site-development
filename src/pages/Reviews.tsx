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
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-fade-up">
            <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">О нас</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
              WHITE <span className="text-primary text-glow-cyan">FRIDAY</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Мы — команда энтузиастов, для которых сборка компьютера это не конвейер, а настоящее ремесло. Каждый ПК собирается вручную, с вниманием к каждой детали: от аккуратной укладки кабелей до тонкой настройки системы охлаждения.
              </p>
              <p>
                Мы не продаём готовые «коробки». Мы подбираем железо под ваши задачи и бюджет, честно рассказываем, на чём можно сэкономить, а на чём — не стоит. И остаёмся на связи даже после покупки.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {[
              { icon: 'Cpu', title: '2400+', text: 'собранных ПК' },
              { icon: 'ShieldCheck', title: 'до 3 лет', text: 'гарантии' },
              { icon: 'HeartHandshake', title: 'Сервис', text: 'человеческое общение' },
              { icon: 'Wrench', title: 'Ручная', text: 'сборка и настройка' },
            ].map((f, i) => (
              <div key={i} className="p-5 md:p-6 bg-card border border-border clip-corner">
                <div className="w-11 h-11 flex items-center justify-center bg-primary/10 text-primary clip-corner mb-3">
                  <Icon name={f.icon} size={22} />
                </div>
                <p className="font-display text-xl md:text-2xl tracking-wide">{f.title}</p>
                <p className="text-muted-foreground text-sm mt-1">{f.text}</p>
              </div>
            ))}
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