import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';

const contacts = [
  { icon: 'Phone', title: 'Телефон', value: '8 800 555-35-35', sub: 'Звонок бесплатный' },
  { icon: 'Mail', title: 'Почта', value: 'hello@neonrig.ru', sub: 'Ответим в течение часа' },
  { icon: 'MapPin', title: 'Шоурум', value: 'Москва, ул. Кибер, 1', sub: 'Ежедневно 10:00 — 21:00' },
];

const Contacts = () => {
  return (
    <Layout>
      <section className="grid-bg border-b border-border">
        <div className="container py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Контакты</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold">СВЯЖИСЬ <span className="text-primary text-glow-cyan">С НАМИ</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Поможем подобрать сборку мечты или ответим на любой вопрос.
          </p>
        </div>
      </section>

      <section className="container py-16 grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center gap-4 p-6 bg-card border border-border clip-corner hover:border-primary/40 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary clip-corner shrink-0">
                <Icon name={c.icon} size={24} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-wide font-display">{c.title}</p>
                <p className="font-display text-xl">{c.value}</p>
                <p className="text-muted-foreground text-sm">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="p-8 bg-card border border-border clip-corner space-y-5" onSubmit={(e) => e.preventDefault()}>
          <h2 className="font-display text-2xl uppercase tracking-wide">Оставить заявку</h2>
          <div>
            <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Имя</label>
            <input type="text" placeholder="Ваше имя" className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Телефон</label>
            <input type="tel" placeholder="+7 (___) ___-__-__" className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Сообщение</label>
            <textarea rows={4} placeholder="Какая сборка интересует?" className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors resize-none" />
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-display uppercase tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan">
            Отправить заявку <Icon name="Send" size={18} />
          </button>
        </form>
      </section>
    </Layout>
  );
};

export default Contacts;
