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

      {/* Виджет отзывов Яндекс.Карт */}
      <section className="container pt-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            ОТЗЫВЫ НА <span className="text-primary text-glow-cyan">ЯНДЕКС.КАРТАХ</span>
          </h2>
          <a
            href="https://yandex.ru/maps/org/white_friday_pc/86872558553/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all font-display uppercase tracking-wider text-sm"
          >
            Открыть на картах <Icon name="ExternalLink" size={16} />
          </a>
        </div>
        <div className="bg-card border border-border clip-corner overflow-hidden animate-fade-up">
          <iframe
            title="Отзывы White Friday PC на Яндекс.Картах"
            src="https://yandex.ru/maps-reviews-widget/86872558553?comments"
            className="w-full h-[600px] border-0"
          />
          <a
            href="https://yandex.ru/maps/org/white_friday_pc/86872558553/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-muted-foreground text-xs py-2 hover:text-primary transition-colors"
          >
            White Friday PC на Яндекс Картах
          </a>
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
            <div key={i} className="p-8 bg-card border border-border clip-corner animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
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
    </Layout>
  );
};

export default Reviews;