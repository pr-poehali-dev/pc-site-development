import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { submitOrder } from '@/lib/submitOrder';
import { contactInfo } from '@/data/content';
import { breadcrumbLd } from '@/data/seo';

const purposeOptions = [
  { id: 'aaa', title: 'Игры с высоким разрешением и максимальными настройками графики (AAA)', icon: 'Gamepad2' },
  { id: 'fps', title: 'Игры, где нужен максимальный FPS и быстрая реакция (онлайн-шутеры)', icon: 'Crosshair' },
  { id: 'universal', title: 'Универсальная машина для работы и игр', icon: 'Layers' },
  { id: 'render', title: 'Рабочая станция для рендера и моделирования', icon: 'Box' },
  { id: 'office', title: 'Для офиса и простых рабочих задач (Word, 1C, Excel и т.д.)', icon: 'Briefcase' },
  { id: 'server', title: 'Для серверных задач и LLM', icon: 'Server' },
  { id: 'streaming', title: 'Игровая машина для стриминга игр', icon: 'Radio' },
];

const buildBudgetSteps = () => {
  const steps: [number, number][] = [];
  for (let v = 50000; v < 350000; v += 25000) steps.push([v, v + 25000]);
  for (let v = 350000; v < 1000000; v += 50000) steps.push([v, v + 50000]);
  return steps;
};
const budgetSteps = buildBudgetSteps();

const silenceOptions = [
  'Максимально тихая конфигурация под нагрузкой',
  'Баланс между ценой и тишиной',
  'Не имеет значения, главное чтобы не работал как вертолёт',
];

const sizeOptions = [
  { id: 'itx-sff', title: 'Компактный ITX / SFF', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/79b32cf4-541e-4b6e-ac6d-9a4196dca4d3.jpg' },
  { id: 'compact-matx', title: 'Компактный mATX', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/6d982e30-c638-454f-bf4a-b1d760c83a7e.jpg' },
  { id: 'standard-matx', title: 'Стандартный mATX', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/41063fcb-c37d-428c-86b2-f20bc9840d7b.jpg' },
  { id: 'standard-atx', title: 'Стандартный ATX', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/cd1e7b01-97a3-4598-ae5d-a42b884da416.jpg' },
  { id: 'full-atx', title: 'Полноразмерный ATX', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/a0649788-9cbd-41a4-b868-f932ce0206c8.jpg' },
  { id: 'any', title: 'Главное практичность', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/a6ce982d-8c5d-4f8a-a2e1-911010b574af.jpg' },
];

const appearanceOptions = [
  { id: 'aquarium', title: 'Аквариумного типа', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/e36672c3-7fad-4085-9bff-c417fed1a586.jpg' },
  { id: 'classic-glass', title: 'Стандартный корпус со стеклом слева', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/f5a50364-db93-4596-9920-dee83d2f75c1.jpg' },
  { id: 'unusual', title: 'Что-то необычное', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/0b5b2537-2cf1-4fc8-ace6-1a36668db052.jpg' },
  { id: 'any', title: 'Главное практичность', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/768678f8-19e7-4764-a1e6-25c3896159d9.jpg' },
];

const lightingOptions = [
  { id: 'contour', title: 'Контурная подсветка', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/7aec69d9-9974-4f0a-a63a-021bf74a90ed.jpg' },
  { id: 'infinity', title: 'Подсветка с эффектом бесконечности', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/a6223dd8-dca4-41e3-8e4b-c90c33e55304.jpg' },
  { id: 'minimal', title: 'Минимум подсветки или без неё', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/a5c6d7a1-8182-45b6-b08c-f749a1a76fa7.jpg' },
  { id: 'engineer', title: 'По умолчанию', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/2e1bb7cf-a7d7-45d9-8064-331e4e6e6b4a.jpg' },
];

const colorOptions = ['Белый', 'Чёрный', 'Другое'];

const upgradeOptions = [
  'Учесть апгрейд видеокарты',
  'Учесть апгрейд процессора',
  'Учесть установку дополнительных M2 дисков',
  'Учесть установку второй видеокарты / PCI устройства',
];

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const selectCls =
  'w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors';
const inputCls =
  'w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors';
const labelCls = 'block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide';

const steps = ['Задачи и бюджет', 'Детали сборки', 'Размер ПК', 'Внешний вид', 'Контакты'];

const BuildPC = () => {
  const [step, setStep] = useState(0);
  const [purposes, setPurposes] = useState<string[]>([]);
  const [budgetIdx, setBudgetIdx] = useState(2);
  const [customBudget, setCustomBudget] = useState(false);
  const [customBudgetValue, setCustomBudgetValue] = useState('');
  const [prefMode, setPrefMode] = useState<'' | 'yes' | 'manager'>('manager');
  const [prefText, setPrefText] = useState('');
  const [wireless, setWireless] = useState<'' | 'yes' | 'no'>('');
  const [upgrade, setUpgrade] = useState<'' | 'yes' | 'no'>('');
  const [upgradeItems, setUpgradeItems] = useState<string[]>([]);
  const [upgradeOther, setUpgradeOther] = useState(false);
  const [upgradeText, setUpgradeText] = useState('');
  const [silence, setSilence] = useState('Баланс между ценой и тишиной');
  const [pcSize, setPcSize] = useState('any');
  const [appearance, setAppearance] = useState('any');
  const [lighting, setLighting] = useState('engineer');
  const [color, setColor] = useState('Чёрный');
  const [colorText, setColorText] = useState('');
  const [contactMethod, setContactMethod] = useState<'' | 'call' | 'text'>('');
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cTelegram, setCTelegram] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [consent, setConsent] = useState(false);

  const canNextStep1 = purposes.length > 0 && prefMode && (prefMode === 'manager' || prefText.trim());

  const formTopRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const next = () => {
    setStep((s) => Math.min(s + 1, steps.length - 1));
    scrollToTop();
  };
  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    scrollToTop();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cPhone.trim()) {
      toast({ title: 'Заполните имя и телефон', description: 'Они нужны, чтобы мы могли связаться с вами.' });
      return;
    }
    if (!consent) {
      toast({ title: 'Нужно согласие', description: 'Отметьте согласие на обработку персональных данных.' });
      return;
    }
    setSending(true);
    const details = Object.fromEntries(summary.map((row) => [row.label, row.value]));
    const payload = JSON.stringify({
      name: cName,
      phone: cPhone,
      telegram: cTelegram,
      contact_method: contactMethod || undefined,
      source: 'build-pc',
      details,
    });
    const ok = await submitOrder(payload);
    if (ok) {
      setSent(true);
    } else {
      toast({
        title: 'Не удалось отправить заявку',
        description: `Проверьте интернет и попробуйте снова или позвоните нам: ${contactInfo.phone}`,
      });
    }
    setSending(false);
  };

  const [minB, maxB] = budgetSteps[budgetIdx];

  const budgetLabel = customBudget
    ? (customBudgetValue ? fmt(Number(customBudgetValue)) : 'не указан')
    : `${fmt(minB)} — ${fmt(maxB)}`;

  const purposeLabel = purposes.length
    ? purposeOptions.filter((p) => purposes.includes(p.id)).map((p) => p.title).join('; ')
    : '—';
  const prefLabel = prefMode === 'manager' ? 'На выбор менеджера' : (prefText.trim() || '—');

  const wirelessLabel = wireless === 'yes' ? 'Да' : wireless === 'no' ? 'Нет' : '—';
  const upgradeParts: string[] = [];
  if (upgrade === 'yes') {
    upgradeParts.push('Да');
    if (upgradeItems.length) upgradeParts.push(...upgradeItems);
  } else if (upgrade === 'no') {
    upgradeParts.push('Нет');
  }
  if (upgradeOther && upgradeText.trim()) upgradeParts.push(`Другое: ${upgradeText.trim()}`);
  const upgradeLabel = upgradeParts.length ? upgradeParts.join('; ') : '—';

  const summary = [
    { label: 'Назначение', value: purposeLabel },
    { label: 'Бюджет', value: budgetLabel },
    { label: 'Комплектующие', value: prefLabel },
    { label: 'Wi-Fi / Bluetooth', value: wirelessLabel },
    { label: 'Запас на апгрейд', value: upgradeLabel },
    { label: 'Важность тишины', value: silence || '—' },
    { label: 'Размер ПК', value: sizeOptions.find((s) => s.id === pcSize)?.title || '—' },
    { label: 'Внешний вид', value: appearanceOptions.find((a) => a.id === appearance)?.title || '—' },
    { label: 'Подсветка', value: lightingOptions.find((l) => l.id === lighting)?.title || '—' },
    { label: 'Цвет ПК', value: color === 'Другое' ? (colorText.trim() || 'Другое') : (color || '—') },
  ];

  return (
    <Layout>
      <SEO
        title="Собрать компьютер на заказ — конфигуратор ПК под ваши задачи | White Friday PC"
        description="Соберём компьютер с нуля под ваш бюджет и задачи: игры, работа, стриминг, монтаж. Подберём комплектующие, соберём и протестируем. Гарантия до 3 лет от мастерской и до 10 лет на комплектующие."
        path="/build"
        jsonLd={breadcrumbLd([
          { name: 'Главная', path: '/' },
          { name: 'Собрать ПК', path: '/build' },
        ])}
      />
      <section className="grid-bg border-b border-border">
        <div className="container py-12 md:py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Конструктор заявки</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold">СОБЕРИ <span className="text-primary text-glow-cyan">СВОЙ ПК</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Ответьте на несколько вопросов — и мы подберём идеальную конфигурацию под ваши задачи.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16 max-w-3xl">
        {sent ? (
          <div className="p-8 md:p-12 bg-card border border-border clip-corner flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center bg-primary/10 text-primary clip-corner">
              <Icon name="CheckCircle2" size={36} />
            </div>
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wide">Ваша заявка отправлена!</h2>
            <p className="text-muted-foreground text-sm max-w-md">Наши менеджеры отвечают на заявки с 11 до 21 часа по Московскому времени!</p>
          </div>
        ) : (
        <>
        <div ref={formTopRef} className="scroll-mt-24" />
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 clip-corner border text-xs font-display uppercase tracking-wide transition-colors ${
                i === step ? 'btn-primary border-glow-cyan' : i < step ? 'border-primary/40 text-primary' : 'border-border text-muted-foreground'
              }`}>
                <span className="font-bold">{i + 1}</span>
                <span className="hidden md:inline">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-4 md:w-8 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <form className="p-6 md:p-8 bg-card border border-border clip-corner space-y-6" onSubmit={handleSubmit}>
          {step === 0 && (
            <>
              <div>
                <label className={labelCls}>Для чего необходим ПК?</label>
                <p className="text-xs text-muted-foreground -mt-1 mb-2">Можно выбрать несколько вариантов.</p>
                <div className="grid gap-3">
                  {purposeOptions.map((p) => {
                    const active = purposes.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          setPurposes((list) =>
                            active ? list.filter((id) => id !== p.id) : [...list, p.id]
                          )
                        }
                        className={`flex items-center gap-3 text-left px-4 py-3 text-sm clip-corner border transition-colors ${
                          active
                            ? 'border-primary/60 text-foreground bg-primary/5'
                            : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        <span className={`w-5 h-5 flex items-center justify-center shrink-0 clip-corner border ${active ? 'bg-primary border-primary text-primary-foreground' : 'border-border'}`}>
                          {active && <Icon name="Check" size={14} />}
                        </span>
                        <Icon name={p.icon} size={20} className="shrink-0" />
                        <span>{p.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <label className={labelCls}>Бюджет</label>
                <div className="bg-background border border-border clip-corner p-5">
                  {customBudget ? (
                    <div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={customBudgetValue}
                        onChange={(e) => setCustomBudgetValue(e.target.value.replace(/[^\d]/g, ''))}
                        placeholder="Введите желаемый бюджет, ₽"
                        className={`${inputCls} text-center text-lg font-display`}
                      />
                      <button
                        type="button"
                        onClick={() => { setCustomBudget(false); setCustomBudgetValue(''); }}
                        className="mt-3 mx-auto flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Icon name="SlidersHorizontal" size={14} /> Вернуться к ползунку
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <span className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan">
                          {fmt(minB)} — {fmt(maxB)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={budgetSteps.length - 1}
                        step={1}
                        value={budgetIdx}
                        onChange={(e) => setBudgetIdx(Number(e.target.value))}
                        className="budget-range w-full cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(budgetIdx / (budgetSteps.length - 1)) * 100}%, hsl(var(--border)) ${(budgetIdx / (budgetSteps.length - 1)) * 100}%, hsl(var(--border)) 100%)`,
                        }}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{fmt(budgetSteps[0][0])}</span>
                        <span>{fmt(budgetSteps[budgetSteps.length - 1][1])}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCustomBudget(true)}
                        className="mt-4 mx-auto flex items-center gap-2 px-4 py-2 text-sm font-display uppercase tracking-wide clip-corner border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        <Icon name="Pencil" size={16} /> Указать бюджет
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <label className={labelCls}>Есть ли предпочтения по комплектующим?</label>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => { setPrefMode('manager'); setPrefText(''); }}
                    className={`flex items-center gap-3 text-left px-4 py-3 text-sm clip-corner border transition-colors ${
                      prefMode === 'manager' ? 'btn-primary border-glow-cyan' : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    <Icon name="Sparkles" size={20} className="shrink-0" />
                    <span>Доверяю выбору менеджера (подберём грамотно под ваши задачи)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefMode('yes')}
                    className={`flex items-center gap-3 text-left px-4 py-3 text-sm clip-corner border transition-colors ${
                      prefMode === 'yes' ? 'btn-primary border-glow-cyan' : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    <Icon name="ListChecks" size={20} className="shrink-0" />
                    <span>Да, есть свои пожелания</span>
                  </button>
                  {prefMode === 'yes' && (
                    <textarea
                      rows={3}
                      value={prefText}
                      onChange={(e) => setPrefText(e.target.value)}
                      placeholder="Например: Ryzen 7, RTX 4070, 32 ГБ DDR5, тихая сборка и т.д."
                      className={`${inputCls} resize-none`}
                    />
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={next}
                disabled={!canNextStep1}
                className="w-full flex items-center justify-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Далее <Icon name="ArrowRight" size={18} />
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className={labelCls}>Нужны беспроводные интерфейсы (Wi-Fi и Bluetooth)?</label>
                <div className="flex flex-wrap gap-2">
                  {([['yes', 'Да'], ['no', 'Нет']] as const).map(([val, txt]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setWireless(val)}
                      className={`px-5 py-2 text-sm font-display uppercase tracking-wide clip-corner border transition-colors ${
                        wireless === val ? 'btn-primary border-glow-cyan' : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {txt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <label className={labelCls}>Нужен ли запас для будущего апгрейда ПК?</label>
                <p className="text-xs text-muted-foreground -mt-1 mb-2">Мощнее блок питания, продуваемый корпус, охлаждение процессора с запасом и т.д.</p>
                <div className="flex flex-wrap gap-2">
                  {([['yes', 'Да'], ['no', 'Нет']] as const).map(([val, txt]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => { setUpgrade(val); if (val !== 'yes') setUpgradeItems([]); }}
                      className={`px-5 py-2 text-sm font-display uppercase tracking-wide clip-corner border transition-colors ${
                        upgrade === val ? 'btn-primary border-glow-cyan' : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {txt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setUpgradeOther((v) => { if (v) setUpgradeText(''); return !v; })}
                    className={`px-5 py-2 text-sm font-display uppercase tracking-wide clip-corner border transition-colors ${
                      upgradeOther ? 'btn-primary border-glow-cyan' : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    Другое
                  </button>
                </div>

                {upgrade === 'yes' && (
                  <div className="mt-3 grid gap-2 animate-fade-up">
                    <p className="text-xs text-muted-foreground">Отметьте, что учесть (по желанию):</p>
                    {upgradeOptions.map((opt) => {
                      const checked = upgradeItems.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setUpgradeItems((items) =>
                              checked ? items.filter((i) => i !== opt) : [...items, opt]
                            )
                          }
                          className={`flex items-center gap-3 text-left px-4 py-3 text-sm clip-corner border transition-colors ${
                            checked ? 'border-primary/60 text-foreground bg-primary/5' : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                          }`}
                        >
                          <span className={`w-5 h-5 flex items-center justify-center shrink-0 clip-corner border ${checked ? 'bg-primary border-primary text-primary-foreground' : 'border-border'}`}>
                            {checked && <Icon name="Check" size={14} />}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {upgradeOther && (
                  <textarea
                    rows={2}
                    value={upgradeText}
                    onChange={(e) => setUpgradeText(e.target.value)}
                    placeholder="Опишите, какой ещё запас нужно учесть"
                    className={`${inputCls} resize-none mt-3`}
                  />
                )}
              </div>

              <div className="h-px bg-border" />

              <div>
                <label className={labelCls}>Насколько важна тишина при использовании?</label>
                <div className="grid gap-3">
                  {silenceOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSilence(s)}
                      className={`flex items-center gap-3 text-left px-4 py-3 text-sm clip-corner border transition-colors ${
                        silence === s ? 'btn-primary border-glow-cyan' : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      <Icon name="Volume2" size={20} className="shrink-0" />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={back}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-background border border-border font-display uppercase tracking-wider clip-corner hover:border-primary/40 transition-colors"
                >
                  <Icon name="ArrowLeft" size={18} /> Назад
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex-1 flex items-center justify-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green"
                >
                  Далее <Icon name="ArrowRight" size={18} />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className={labelCls}>Выберите размер ПК</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sizeOptions.map((s) => {
                    const active = pcSize === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setPcSize(s.id)}
                        className={`group text-left clip-corner border overflow-hidden transition-colors ${
                          active ? 'border-glow-cyan' : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="relative aspect-[16/11] bg-background overflow-hidden">
                          <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          {active && (
                            <div className="absolute top-2 right-2 w-7 h-7 rounded-full btn-primary flex items-center justify-center">
                              <Icon name="Check" size={16} />
                            </div>
                          )}
                        </div>
                        <div className={`px-4 py-3 text-sm font-display uppercase tracking-wide ${active ? 'btn-primary' : 'bg-card text-muted-foreground'}`}>
                          {s.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={back}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-background border border-border font-display uppercase tracking-wider clip-corner hover:border-primary/40 transition-colors"
                >
                  <Icon name="ArrowLeft" size={18} /> Назад
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!pcSize}
                  className="flex-1 flex items-center justify-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Далее <Icon name="ArrowRight" size={18} />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className={labelCls}>Какой внешний вид компьютера тебе больше нравится?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {appearanceOptions.map((a) => {
                    const active = appearance === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAppearance(a.id)}
                        className={`group text-left clip-corner border overflow-hidden transition-colors ${
                          active ? 'border-glow-cyan' : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="relative aspect-[16/11] bg-background overflow-hidden">
                          <img src={a.image} alt={a.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          {active && (
                            <div className="absolute top-2 right-2 w-7 h-7 rounded-full btn-primary flex items-center justify-center">
                              <Icon name="Check" size={16} />
                            </div>
                          )}
                        </div>
                        <div className={`px-4 py-3 text-sm font-display uppercase tracking-wide ${active ? 'btn-primary' : 'bg-card text-muted-foreground'}`}>
                          {a.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <label className={labelCls}>Какое пожелание по подсветке в компьютере?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lightingOptions.map((l) => {
                    const active = lighting === l.id;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLighting(l.id)}
                        className={`group text-left clip-corner border overflow-hidden transition-colors ${
                          active ? 'border-glow-cyan' : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="relative aspect-[16/11] bg-background overflow-hidden">
                          <img src={l.image} alt={l.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          {active && (
                            <div className="absolute top-2 right-2 w-7 h-7 rounded-full btn-primary flex items-center justify-center">
                              <Icon name="Check" size={16} />
                            </div>
                          )}
                        </div>
                        <div className={`px-4 py-3 text-sm font-display uppercase tracking-wide ${active ? 'btn-primary' : 'bg-card text-muted-foreground'}`}>
                          {l.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <label className={labelCls}>Какой цвет всего ПК хотелось бы?</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setColor(c); if (c !== 'Другое') setColorText(''); }}
                      className={`px-5 py-2 text-sm font-display uppercase tracking-wide clip-corner border transition-colors ${
                        color === c ? 'btn-primary border-glow-cyan' : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {color === 'Другое' && (
                  <input
                    type="text"
                    value={colorText}
                    onChange={(e) => setColorText(e.target.value)}
                    placeholder="Укажите желаемый цвет"
                    className={`${inputCls} mt-3`}
                  />
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={back}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-background border border-border font-display uppercase tracking-wider clip-corner hover:border-primary/40 transition-colors"
                >
                  <Icon name="ArrowLeft" size={18} /> Назад
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!appearance || !lighting || !color}
                  className="flex-1 flex items-center justify-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Далее <Icon name="ArrowRight" size={18} />
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <label className={labelCls}>Ваша конфигурация</label>
                <div className="bg-background border border-border clip-corner divide-y divide-border">
                  {summary.map((row) => (
                    <div key={row.label} className="flex gap-4 px-4 py-3 text-sm">
                      <span className="text-muted-foreground font-display uppercase tracking-wide text-xs shrink-0 w-40 pt-0.5">{row.label}</span>
                      <span className="flex-1 text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Имя</label>
                  <input value={cName} onChange={(e) => setCName(e.target.value)} type="text" placeholder="Ваше имя" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Телефон</label>
                  <input value={cPhone} onChange={(e) => setCPhone(e.target.value)} type="tel" placeholder="+7 (___) ___-__-__" className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Никнейм в Telegram (необязательно)</label>
                <input value={cTelegram} onChange={(e) => setCTelegram(e.target.value)} type="text" placeholder="@username" className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Как удобнее связаться?</label>
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

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={back}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-background border border-border font-display uppercase tracking-wider clip-corner hover:border-primary/40 transition-colors"
                >
                  <Icon name="ArrowLeft" size={18} /> Назад
                </button>
                <button
                  type="submit"
                  disabled={sending || !consent}
                  className="flex-1 flex items-center justify-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green disabled:opacity-40"
                >
                  {sending ? 'Отправка...' : 'Отправить заявку'} <Icon name="Send" size={18} />
                </button>
              </div>
            </>
          )}
        </form>
        </>
        )}
      </section>
    </Layout>
  );
};

export default BuildPC;