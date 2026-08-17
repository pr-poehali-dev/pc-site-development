import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import Icon from '@/components/ui/icon';
import { socials, contactInfo } from '@/data/content';
import { localBusinessLd, breadcrumbLd, COMPANY_LEGAL_NAME, COMPANY_INN, COMPANY_OGRNIP } from '@/data/seo';
import { submitOrder } from '@/lib/submitOrder';

const contacts = [
  { icon: 'Phone', title: 'Телефон', value: contactInfo.phone, sub: 'Звоните с 11 до 21 по МСК времени!', href: contactInfo.phoneHref },
  { icon: 'Mail', title: 'Почта', value: contactInfo.email, sub: '', href: contactInfo.emailHref },
  { icon: 'MapPin', title: 'Основной офис', value: contactInfo.address, sub: contactInfo.hours, href: contactInfo.addressHref, external: true },
  { icon: 'Store', title: 'Пункт выдачи · СПб', value: contactInfo.addressSpb, sub: '', href: contactInfo.addressSpbHref, external: true },
  { icon: 'Store', title: 'Пункт выдачи · Краснодар', value: contactInfo.addressKrd, sub: '', href: contactInfo.addressKrdHref, external: true },
];

const requisites = [
  { icon: 'Building2', label: 'Наименование', value: COMPANY_LEGAL_NAME },
  { icon: 'FileText', label: 'ИНН', value: COMPANY_INN },
  { icon: 'FileCheck', label: 'ОГРНИП', value: COMPANY_OGRNIP },
  { icon: 'Landmark', label: 'Расчётный счёт', value: '40802810420000213855' },
  { icon: 'Phone', label: 'Телефон', value: contactInfo.phone },
  { icon: 'Mail', label: 'E-mail', value: contactInfo.email },
];

const delivery = [
  { icon: 'Truck', title: 'Курьером по Москве', text: 'Доставка осуществляется в вечернее время с 19:00 до 23:30. Бесплатно при заказе от 250 000 ₽.' },
  { icon: 'Package', title: 'ТК СДЭК по РФ и СНГ', text: '1–7 дней не считая дня отправки. Включает в себя обязательную страховку груза и нашу усиленную упаковку, которую не смогли победить даже самые "легендарные" службы доставки! =)' },
  { icon: 'Store', title: 'Самовывоз из шоурума', text: 'Заберите готовый ПК сами и проверьте его прямо на месте.' },
];

const Contacts = () => {
  const [contactMethod, setContactMethod] = useState<'' | 'call' | 'text'>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const build = searchParams.get('build');
    if (build) setMessage(`Здравствуйте! Хочу заказать сборку «${build}»`);
  }, [searchParams]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Укажите имя и телефон');
      return;
    }
    if (!consent) {
      setError('Необходимо согласие на обработку персональных данных');
      return;
    }
    setError('');
    setSending(true);
    const ok = await submitOrder(
      JSON.stringify({
        name,
        phone,
        telegram,
        comment: message,
        contact_method: contactMethod === 'text' ? 'text' : contactMethod === 'call' ? 'call' : undefined,
        source: 'contacts',
      }),
    );
    if (ok) {
      setSent(true);
      setName('');
      setPhone('');
      setTelegram('');
      setMessage('');
      setContactMethod('');
      setConsent(false);
    } else {
      setError(`Не удалось отправить. Проверьте интернет и попробуйте снова или позвоните нам: ${contactInfo.phone}`);
    }
    setSending(false);
  };

  return (
    <Layout>
      <SEO
        title="Контакты White Friday PC — адрес, телефон, режим работы"
        description="Как с нами связаться: телефон, email, адрес мастерской в Москве, пункты выдачи в Санкт-Петербурге и Краснодаре. Ежедневно 11:00–21:00."
        path="/contacts"
        jsonLd={[
          localBusinessLd,
          breadcrumbLd([
            { name: 'Главная', path: '/' },
            { name: 'Контакты', path: '/contacts' },
          ]),
        ]}
      />
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
              <p className="text-muted-foreground text-sm">Наши менеджеры отвечают на заявки с 11 до 21 часа по Московскому времени!</p>
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
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 shrink-0 accent-primary"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Я согласен на обработку персональных данных и принимаю{' '}
                  <Link to="/privacy" target="_blank" className="text-primary hover:underline">Политику конфиденциальности</Link>{' '}
                  и{' '}
                  <Link to="/consent" target="_blank" className="text-primary hover:underline">условия обработки данных</Link>.
                </span>
              </label>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={sending || !consent} className="w-full flex items-center justify-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green disabled:opacity-40">
                {sending ? 'Отправка...' : 'Отправить заявку'} <Icon name="Send" size={18} />
              </button>
            </>
          )}
        </form>
      </section>

      <section className="container pb-4 md:pb-8">
        <div className="p-6 md:p-8 bg-card border border-border clip-corner animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary clip-corner shrink-0">
              <Icon name="ScrollText" size={24} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm uppercase tracking-wide font-display">Официальные данные</p>
              <h2 className="font-display text-2xl uppercase tracking-wide">Реквизиты</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {requisites.map((r, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50">
                <Icon name={r.icon} size={18} className="text-primary mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide font-display">{r.label}</p>
                  <p className="break-words">{r.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
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