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
            Тысячи геймеров, дизайнеров и профессионалов уже выбрали NEONRIG.
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
