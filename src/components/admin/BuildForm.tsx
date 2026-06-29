import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { saveBuild, type ApiBuild, type BuildInput } from '@/lib/buildsApi';

interface Props {
  build: ApiBuild | null;
  onClose: () => void;
  onSaved: () => void;
}

const fields: { key: keyof BuildInput; label: string; icon: string }[] = [
  { key: 'cpu', label: 'Процессор', icon: 'Cpu' },
  { key: 'gpu', label: 'Видеокарта', icon: 'MonitorPlay' },
  { key: 'motherboard', label: 'Материнская плата', icon: 'CircuitBoard' },
  { key: 'ram', label: 'Оперативная память', icon: 'MemoryStick' },
  { key: 'storage', label: 'Накопитель', icon: 'HardDrive' },
  { key: 'psu', label: 'Блок питания', icon: 'Plug' },
  { key: 'cpu_cooling', label: 'Охлаждение CPU', icon: 'Fan' },
  { key: 'fans', label: 'Вентиляторы (опционально)', icon: 'Wind' },
  { key: 'extras', label: 'Экраны и прочее (опционально)', icon: 'Monitor' },
  { key: 'case_model', label: 'Модель корпуса', icon: 'Box' },
];

const BuildForm = ({ build, onClose, onSaved }: Props) => {
  const [form, setForm] = useState<BuildInput>({
    id: build?.id,
    name: build?.name || '',
    tagline: build?.tagline || '',
    price: build?.price || 0,
    image_url: build?.image_url || '',
    build_date: build?.build_date || '',
    cpu: build?.cpu || '',
    gpu: build?.gpu || '',
    motherboard: build?.motherboard || '',
    ram: build?.ram || '',
    storage: build?.storage || '',
    psu: build?.psu || '',
    cpu_cooling: build?.cpu_cooling || '',
    fans: build?.fans || '',
    extras: build?.extras || '',
    case_model: build?.case_model || '',
    is_published: build?.is_published ?? true,
  });
  const [imagePreview, setImagePreview] = useState(build?.image_url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof BuildInput, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setForm((f) => ({ ...f, image_base64: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name?.trim()) {
      setError('Укажите название сборки');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await saveBuild(form);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="w-full max-w-2xl bg-card border border-border clip-corner p-6 md:p-8 my-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl uppercase tracking-wide">
            {build ? 'Редактировать сборку' : 'Новая сборка'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={24} />
          </button>
        </div>

        {error && (
          <div className="px-4 py-3 mb-4 bg-destructive/10 border border-destructive/40 text-destructive text-sm clip-corner">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Фото */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Фото сборки</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-28 h-20 object-cover clip-corner border border-border" />
              ) : (
                <div className="w-28 h-20 flex items-center justify-center bg-background border border-border clip-corner text-muted-foreground">
                  <Icon name="Image" size={24} />
                </div>
              )}
              <label className="px-5 py-2.5 bg-muted text-foreground font-display uppercase text-xs tracking-wider clip-corner hover:opacity-90 transition-opacity cursor-pointer">
                Загрузить файл
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            </div>
          </div>

          {/* Название и описание */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Название</label>
              <input
                type="text"
                value={form.name || ''}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Например, WHITE STORM"
                className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Цена, ₽</label>
              <input
                type="number"
                value={form.price || 0}
                onChange={(e) => set('price', Number(e.target.value))}
                className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Описание</label>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={(e) => set('tagline', e.target.value)}
                placeholder="Короткая фраза-описание"
                className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Дата сборки</label>
              <input
                type="date"
                value={form.build_date || ''}
                onChange={(e) => set('build_date', e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Комплектующие */}
          <div className="grid md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">
                  <Icon name={f.icon} size={14} className="text-primary" /> {f.label}
                </label>
                <input
                  type="text"
                  value={(form[f.key] as string) || ''}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Публикация */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published ?? true}
              onChange={(e) => set('is_published', e.target.checked)}
              className="w-5 h-5 accent-[hsl(var(--primary))]"
            />
            <span className="font-display uppercase text-sm tracking-wide">Показывать на сайте</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan disabled:opacity-50"
            >
              {saving ? 'Сохранение...' : 'Сохранить'} <Icon name="Check" size={18} />
            </button>
            <button
              onClick={onClose}
              className="px-7 py-3 border border-border text-foreground font-display uppercase text-sm tracking-wider clip-corner hover:border-primary/50 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildForm;