import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { reviews } from '@/data/content';

const stats = [
  { value: '4.9', label: 'Средний рейтинг' },
  { value: '2 500+', label: 'Довольных клиентов' },
  { value: '98%', label: 'Рекомендуют нас' },
];

const Reviews = () => {
  return (
    <Layout>
      <section className="grid-bg border-b border-border">
        <div className="container py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Отзывы</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold">НАМ <span className="text-primary text-glow-cyan">ДОВЕРЯЮТ</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Геймеры, дизайнеры и профессионалы уже выбрали White Friday PC.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid grid-cols-3 gap-6 mb-16">
          {stats.map((s, i) => (
            <div key={i} className="p-6 text-center bg-card border border-border clip-corner animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan">{s.value}</p>
              <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="flex flex-col p-8 bg-card border border-border clip-corner animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
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

              <p className="text-foreground mb-6 font-sans">«{r.text}»</p>

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

        <div className="mt-16 p-8 md:p-10 bg-card border border-border clip-corner flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-up">
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
            className="flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-display uppercase tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan shrink-0"
          >
            Читать на Яндекс.Картах <Icon name="ExternalLink" size={18} />
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Reviews;