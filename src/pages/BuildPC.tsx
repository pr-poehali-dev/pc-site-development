import { useState } from 'react';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

const purposeOptions = [
  { id: 'aaa', title: 'Игры с высоким разрешением и максимальными настройками графики (AAA)', icon: 'Gamepad2' },
  { id: 'fps', title: 'Игры, где нужен максимальный FPS и быстрая реакция (онлайн-шутеры)', icon: 'Crosshair' },
  { id: 'universal', title: 'Универсальная машина для работы и игр', icon: 'Layers' },
  { id: 'render', title: 'Рабочая станция для рендера и моделирования', icon: 'Box' },
  { id: 'office', title: 'Для офиса и простых рабочих задач (Word, 1C, Excel и т.д.)', icon: 'Briefcase' },
  { id: 'server', title: 'Для серверных задач и LLM', icon: 'Server' },
];

const buildBudgetSteps = () => {
  const steps: [number, number][] = [];
  for (let v = 50000; v < 350000; v += 25000) steps.push([v, v + 25000]);
  for (let v = 350000; v < 1000000; v += 50000) steps.push([v, v + 50000]);
  return steps;
};
const budgetSteps = buildBudgetSteps();

const cases = ['Компактный (Mini-ITX)', 'Средний (Mid-Tower)', 'Большой (Full-Tower)', 'На выбор мастера'];
const rgbOptions = ['Без подсветки', 'Минимальная', 'Яркая RGB', 'На выбор мастера'];
const silenceOptions = [
  'Максимально тихая конфигурация под нагрузкой',
  'Баланс между ценой и тишиной',
  'Не имеет значения, главное чтобы не работал как вертолёт',
];

const sizeOptions = [
  { id: 'itx-sff', title: 'Компактный ITX / SFF', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/97c174e9-f073-47d1-ae1f-b265950e0423.png' },
  { id: 'compact-matx', title: 'Компактный mATX', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/c2256bf4-09d5-42b2-bd22-554fcc4f674b.jpg' },
  { id: 'standard-matx', title: 'Стандартный mATX', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/a3966c80-12e1-4a42-88cc-f20850e9f0c7.jpg' },
  { id: 'standard-atx', title: 'Стандартный ATX', image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/502e671e-9483-4d18-9d13-fd730ad55643.jpg' },
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
  const [purpose, setPurpose] = useState('');
  const [budgetIdx, setBudgetIdx] = useState(2);
  const [customBudget, setCustomBudget] = useState(false);
  const [customBudgetValue, setCustomBudgetValue] = useState('');
  const [prefMode, setPrefMode] = useState<'' | 'yes' | 'manager'>('');
  const [prefText, setPrefText] = useState('');
  const [caseType, setCaseType] = useState('');
  const [rgb, setRgb] = useState('');
  const [styleText, setStyleText] = useState('');
  const [wireless, setWireless] = useState<'' | 'yes' | 'no'>('');
  const [upgrade, setUpgrade] = useState<'' | 'yes' | 'no' | 'other'>('');
  const [upgradeText, setUpgradeText] = useState('');
  const [silence, setSilence] = useState('');
  const [pcSize, setPcSize] = useState('');

  const canNextStep1 = purpose && prefMode && (prefMode === 'manager' || prefText.trim());

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Заявка отправлена!',
      description: 'Наш инженер свяжется с вами и уточнит детали сборки.',
    });
  };

  const [minB, maxB] = budgetSteps[budgetIdx];

  const budgetLabel = customBudget
    ? (customBudgetValue ? fmt(Number(customBudgetValue)) : 'не указан')
    : `${fmt(minB)} — ${fmt(maxB)}`;

  const purposeLabel = purposeOptions.find((p) => p.id === purpose)?.title || '—';
  const prefLabel = prefMode === 'manager' ? 'На выбор менеджера' : (prefText.trim() || '—');

  const wirelessLabel = wireless === 'yes' ? 'Да' : wireless === 'no' ? 'Нет' : '—';
  const upgradeLabel = upgrade === 'yes' ? 'Да' : upgrade === 'no' ? 'Нет' : upgrade === 'other' ? (upgradeText.trim() || 'Другое') : '—';

  const summary = [
    { label: 'Назначение', value: purposeLabel },
    { label: 'Бюджет', value: budgetLabel },
    { label: 'Комплектующие', value: prefLabel },
    { label: 'Wi-Fi / Bluetooth', value: wirelessLabel },
    { label: 'Запас на апгрейд', value: upgradeLabel },
    { label: 'Важность тишины', value: silence || '—' },
    { label: 'Размер ПК', value: sizeOptions.find((s) => s.id === pcSize)?.title || '—' },
    { label: 'Корпус', value: caseType || '—' },
    { label: 'Подсветка', value: rgb || '—' },
    { label: 'Пожелания по стилю', value: styleText.trim() || '—' },
  ];

  return (
    <Layout>
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
                <div className="grid gap-3">
                  {purposeOptions.map((p) => {
                    const active = purpose === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPurpose(p.id)}
                        className={`flex items-center gap-3 text-left px-4 py-3 text-sm clip-corner border transition-colors ${
                          active
                            ? 'btn-primary border-glow-cyan'
                            : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        <Icon name={p.icon} size={20} className="shrink-0" />
                        <span>{p.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

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

              <div>
                <label className={labelCls}>Есть ли предпочтения по комплектующим?</label>
                <div className="grid gap-3">
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

              <div>
                <label className={labelCls}>Нужен ли запас для будущего апгрейда ПК?</label>
                <p className="text-xs text-muted-foreground -mt-1 mb-2">Мощнее блок питания, продуваемый корпус, охлаждение процессора с запасом и т.д.</p>
                <div className="flex flex-wrap gap-2">
                  {([['yes', 'Да'], ['no', 'Нет'], ['other', 'Другое']] as const).map(([val, txt]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => { setUpgrade(val); if (val !== 'other') setUpgradeText(''); }}
                      className={`px-5 py-2 text-sm font-display uppercase tracking-wide clip-corner border transition-colors ${
                        upgrade === val ? 'btn-primary border-glow-cyan' : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {txt}
                    </button>
                  ))}
                </div>
                {upgrade === 'other' && (
                  <textarea
                    rows={2}
                    value={upgradeText}
                    onChange={(e) => setUpgradeText(e.target.value)}
                    placeholder="Опишите, какой запас нужен"
                    className={`${inputCls} resize-none mt-3`}
                  />
                )}
              </div>

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
                        <div className="relative aspect-video bg-background overflow-hidden">
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
                <label className={labelCls}>Форм-фактор / корпус</label>
                <select className={selectCls} value={caseType} onChange={(e) => setCaseType(e.target.value)}>
                  <option value="" disabled>Выберите вариант</option>
                  {cases.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className={labelCls}>Подсветка (RGB)</label>
                <div className="flex flex-wrap gap-2">
                  {rgbOptions.map((r) => {
                    const active = rgb === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRgb(r)}
                        className={`px-4 py-2 text-sm font-display uppercase tracking-wide clip-corner border transition-colors ${
                          active ? 'btn-primary border-glow-cyan' : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className={labelCls}>Пожелания по стилю и подсветке</label>
                <textarea rows={4} value={styleText} onChange={(e) => setStyleText(e.target.value)} placeholder="Цвет корпуса, RGB, тихая сборка, кастомные детали и т.д." className={`${inputCls} resize-none`} />
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

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Имя</label>
                  <input type="text" placeholder="Ваше имя" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Телефон</label>
                  <input type="tel" placeholder="+7 (___) ___-__-__" className={inputCls} />
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
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green"
                >
                  Отправить заявку <Icon name="Send" size={18} />
                </button>
              </div>
            </>
          )}
        </form>
      </section>
    </Layout>
  );
};

export default BuildPC;