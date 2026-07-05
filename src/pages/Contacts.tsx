import { useState } from 'react';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { socials, contactInfo } from '@/data/content';
import func2url from '../../backend/func2url.json';

const ORDERS_URL = func2url['orders'];

const contacts = [
  { icon: 'Phone', title: 'Телефон', value: contactInfo.phone, sub: 'Звоните с 11 до 21 по МСК времени!', href: contactInfo.phoneHref },
  { icon: 'Mail', title: 'Почта', value: contactInfo.email, sub: '', href: contactInfo.emailHref },
  { icon: 'MapPin', title: 'Основной офис', value: contactInfo.address, sub: contactInfo.hours, href: contactInfo.addressHref, external: true },
  { icon: 'Store', title: 'Пункт выдачи · СПб', value: contactInfo.addressSpb, sub: '', href: contactInfo.addressSpbHref, external: true },
  { icon: 'Store', title: 'Пункт выдачи · Краснодар', value: contactInfo.addressKrd, sub: '', href: contactInfo.addressKrdHref, external: true },
];

const delivery = [
  { icon: 'Truck', title: 'Курьером по Москве', text: 'Доставка осуществляется в вечернее время с 19:00 до 23:30. Бесплатно при заказе от 250 000 ₽.' },
  { icon: 'Package', title: 'Транспортной по РФ', text: '2–7 дней. Усиленная упаковка и страховка груза в подарок.' },
  { icon: 'Store', title: 'Самовывоз из шоурума', text: 'Заберите готовый ПК сами и проверьте его прямо на месте.' },
];

const Contacts = () => {
  const [contactMethod, setContactMethod] = useState<'' | 'call' | 'text'>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Укажите имя и телефон');
      return;
    }
    setError('');
    setSending(true);
    try {
      const res = await fetch(ORDERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          telegram,
          comment: message,
          contact_method: contactMethod === 'text' ? 'text' : contactMethod === 'call' ? 'call' : undefined,
          source: 'contacts',
        }),
      });
      if (!res.ok) throw new Error('fail');
      setSent(true);
      setName('');
      setPhone('');
      setTelegram('');
      setMessage('');
      setContactMethod('');
    } catch {
      setError('Не удалось отправить. Попробуйте позже или позвоните нам.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <section className="grid-bg border-b border-border">
        <div className="container py-12 md:py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Контакты и доставка</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold">СВЯЖИСЬ <span className="text-primary text-glow-cyan">С НАМИ</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Поможем подобрать сборку мечты, ответим на любой вопрос и доставим ПК в любую точку России.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16 grid lg:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-4 order-2 lg:order-1 min-w-0">
          {contacts.map((c, i) => {
            const inner = (
              <>
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary clip-corner shrink-0">
                  <Icon name={c.icon} size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-sm uppercase tracking-wide font-display">{c.title}</p>
                  <p className="font-display text-xl break-words">{c.value}</p>
                  {c.sub && <p className="text-muted-foreground text-sm">{c.sub}</p>}
                </div>
              </>
            );
            const cls = "flex items-center gap-4 p-6 bg-card border border-border clip-corner hover:border-primary/40 transition-colors animate-fade-up";
            return c.href ? (
              <a
                key={i}
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={cls}
                style={{ animationDelay: `${i * 0.1}s` }}
              >{inner}</a>
            ) : (
              <div key={i} className={cls} style={{ animationDelay: `${i * 0.1}s` }}>{inner}</div>
            );
          })}

          <div className="p-6 bg-card border border-border clip-corner animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-muted-foreground text-sm uppercase tracking-wide font-display mb-4">Мы в соцсетях</p>
            <div className="space-y-3">
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary clip-corner shrink-0">
                    <Icon name={s.icon} size={20} />
                  </div>
                  <span className="font-display tracking-wide">{s.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <form className="p-6 md:p-8 bg-card border border-border clip-corner space-y-5 order-1 lg:order-2 min-w-0" onSubmit={submit}>
          <h2 className="font-display text-2xl uppercase tracking-wide">Оставить заявку</h2>
          {sent ? (
            <div className="flex flex-col items-center text-center gap-3 py-6">
              <div className="w-14 h-14 flex items-center justify-center bg-primary/10 text-primary clip-corner">
                <Icon name="CheckCircle2" size={30} />
              </div>
              <p className="font-display text-xl uppercase tracking-wide">Ваша заявка отправлена!</p>
              <p className="text-muted-foreground text-sm">Наши менеджеры отвечают на заявки с 11 до 22 часов по Московскому времени!</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Имя</label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Ваше имя" className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Телефон</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+7 (___) ___-__-__" className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Никнейм в Telegram (необязательно)</label>
                <input value={telegram} onChange={(e) => setTelegram(e.target.value)} type="text" placeholder="@username" className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Сообщение</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Какая сборка интересует?" className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Как удобнее связаться?</label>
                <div className="flex flex-wrap gap-2">
                  {([['call', 'Лучше звонить'], ['text', 'Лучше писать']] as const).map(([val, txt]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setContactMethod(val)}
                      className={`px-5 py-2 text-sm font-display uppercase tracking-wide clip-corner border transition-colors ${
                        contactMethod === val ? 'btn-primary border-glow-cyan' : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {txt}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green disabled:opacity-40">
                {sending ? 'Отправка...' : 'Отправить заявку'} <Icon name="Send" size={18} />
              </button>
            </>
          )}
        </form>
      </section>

      <section className="py-12 md:py-16 grid-bg border-y border-border">
        <div className="container">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-primary font-display uppercase tracking-widest text-sm mb-2">Доставка</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">КАК МЫ <span className="text-primary text-glow-cyan">ДОСТАВЛЯЕМ</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {delivery.map((d, i) => (
              <div key={i} className="p-6 md:p-8 bg-card/60 backdrop-blur border border-border clip-corner animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary clip-corner mb-4">
                  <Icon name={d.icon} size={24} />
                </div>
                <h3 className="font-display text-xl uppercase tracking-wide mb-2">{d.title}</h3>
                <p className="text-muted-foreground">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contacts;