import { useState } from 'react';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

const purposes = ['Игры', 'Стриминг', 'Работа / рендер', 'Монтаж видео', '3D / CAD', 'Офис / учёба'];
const budgets = ['до 100 000 ₽', '100–150 000 ₽', '150–250 000 ₽', '250–400 000 ₽', 'от 400 000 ₽'];
const cooling = ['Воздушное', 'Жидкостное (СЖО)', 'Кастомная СЖО (КСЖО)', 'На выбор мастера'];

const selectCls =
  'w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors';
const inputCls =
  'w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors';
const labelCls = 'block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide';

const BuildPC = () => {
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);

  const togglePurpose = (p: string) =>
    setSelectedPurposes((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Заявка отправлена!',
      description: 'Наш инженер свяжется с вами и уточнит детали сборки.',
    });
  };

  return (
    <Layout>
      <section className="grid-bg border-b border-border">
        <div className="container py-12 md:py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Конструктор заявки</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold">СОБЕРИ <span className="text-primary text-glow-cyan">СВОЙ ПК</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Расширенная форма заявки для тех, кто уже примерно понимает, что он хочет видеть на своём столе.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16 max-w-3xl">
        <form className="p-6 md:p-8 bg-card border border-border clip-corner space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className={labelCls}>Для чего собираем? (можно несколько)</label>
            <div className="flex flex-wrap gap-2">
              {purposes.map((p) => {
                const active = selectedPurposes.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePurpose(p)}
                    className={`px-4 py-2 text-sm font-display uppercase tracking-wide clip-corner border transition-colors ${
                      active
                        ? 'btn-primary border-glow-cyan'
                        : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Бюджет</label>
              <select className={selectCls} defaultValue="">
                <option value="" disabled>Выберите бюджет</option>
                {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Охлаждение</label>
              <select className={selectCls} defaultValue="">
                <option value="" disabled>Выберите тип</option>
                {cooling.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Процессор (CPU)</label>
              <input type="text" placeholder="Напр. Ryzen 7 / Intel i7 или «на выбор»" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Видеокарта (GPU)</label>
              <input type="text" placeholder="Напр. RTX 4070 или «на выбор»" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Оперативная память</label>
              <input type="text" placeholder="Напр. 32 ГБ DDR5" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Накопитель</label>
              <input type="text" placeholder="Напр. 2 ТБ SSD NVMe" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Пожелания по стилю и подсветке</label>
            <textarea rows={3} placeholder="Цвет корпуса, RGB, тихая сборка, кастомные детали и т.д." className={`${inputCls} resize-none`} />
          </div>

          <div className="h-px bg-border" />

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

          <button type="submit" className="w-full flex items-center justify-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green">
            Отправить заявку <Icon name="Send" size={18} />
          </button>
        </form>
      </section>
    </Layout>
  );
};

export default BuildPC;
