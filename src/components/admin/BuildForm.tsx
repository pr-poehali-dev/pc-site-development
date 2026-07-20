import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { saveBuild, type ApiBuild, type BuildInput } from '@/lib/buildsApi';
import { isEmbedSupported } from '@/lib/videoEmbed';

interface Props {
  build: ApiBuild | null;
  onClose: () => void;
  onSaved: (isNew: boolean) => void;
}

interface MediaItem {
  type: 'photo' | 'video' | 'embed';
  url?: string;      // уже загруженный (существующий) или ссылка для embed
  base64?: string;   // новый файл для загрузки
  preview: string;   // что показать в форме
}

const MAX_PHOTOS = 3;
const MAX_VIDEO_MB = 40;

const DRAFT_KEY = 'wf_build_draft';

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

const buildDefault = (build: ApiBuild | null): BuildInput => ({
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

const BuildForm = ({ build, onClose, onSaved }: Props) => {
  const [form, setForm] = useState<BuildInput>(() => {
    // Восстановление черновика только для новой сборки
    if (!build) {
      try {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) return JSON.parse(draft);
      } catch {
        /* ignore */
      }
    }
    return buildDefault(build);
  });
  const [media, setMedia] = useState<MediaItem[]>(() => {
    if (build?.media && build.media.length > 0) {
      return build.media.map((m) => ({
        type:
          m.media_type === 'video'
            ? ('video' as const)
            : m.media_type === 'embed'
            ? ('embed' as const)
            : ('photo' as const),
        url: m.url,
        preview: m.url,
      }));
    }
    if (build?.image_url) {
      return [{ type: 'photo' as const, url: build.image_url, preview: build.image_url }];
    }
    return [];
  });
  const [videoLink, setVideoLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const photos = media.filter((m) => m.type === 'photo');
  const videos = media.filter((m) => m.type === 'video');
  const embeds = media.filter((m) => m.type === 'embed');

  const handleAddLink = () => {
    const link = videoLink.trim();
    if (!link) return;
    if (!isEmbedSupported(link)) {
      setError('Ссылку не удалось распознать. Поддерживаются YouTube, VK и RuTube.');
      return;
    }
    setMedia((m) => [...m, { type: 'embed', url: link, preview: link }]);
    setVideoLink('');
    setError('');
  };

  // Автосохранение черновика для новой сборки
  useEffect(() => {
    if (build) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form, build]);

  const set = (key: keyof BuildInput, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxSize = 1600;
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Не удалось обработать изображение'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => reject(new Error('Не удалось загрузить изображение'));
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
      reader.readAsDataURL(file);
    });

  const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;
    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      setError(`Можно добавить максимум ${MAX_PHOTOS} фото.`);
      return;
    }
    try {
      const toAdd: MediaItem[] = [];
      for (const file of files.slice(0, room)) {
        const compressed = await compressImage(file);
        toAdd.push({ type: 'photo', base64: compressed, preview: compressed });
      }
      setMedia((m) => [...m, ...toAdd]);
      setError('');
    } catch {
      setError('Не удалось обработать изображение. Попробуйте другое фото.');
    }
  };

  const handleAddVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`Видео слишком большое (макс. ${MAX_VIDEO_MB} МБ). Сожмите файл или загрузите короче.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setMedia((m) => [...m.filter((x) => x.type !== 'video'), { type: 'video', base64: dataUrl, preview: dataUrl }]);
      setError('');
    };
    reader.onerror = () => setError('Не удалось прочитать видео.');
    reader.readAsDataURL(file);
  };

  const removeMedia = (target: MediaItem) => {
    setMedia((m) => m.filter((x) => x !== target));
  };

  const movePhoto = (target: MediaItem, dir: -1 | 1) => {
    setMedia((m) => {
      const arr = [...m];
      const idx = arr.indexOf(target);
      const swap = idx + dir;
      if (swap < 0 || swap >= arr.length) return m;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr;
    });
  };

  const handleSave = async () => {
    if (!form.name?.trim()) {
      setError('Укажите название сборки');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const mediaPayload = media.map((m) => ({
        media_type: m.type,
        ...(m.base64 ? { base64: m.base64 } : { url: m.url }),
      }));
      await saveBuild({ ...form, media: mediaPayload });
      localStorage.removeItem(DRAFT_KEY);
      onSaved(!build);
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
          {/* Медиа: фото + видео */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">
              Медиа сборки — до {MAX_PHOTOS} фото и/или видео
            </label>

            {media.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {media.map((m, i) => (
                  <div key={i} className="relative w-28 h-20 clip-corner border border-border overflow-hidden group bg-background">
                    {m.type === 'photo' ? (
                      <img src={m.preview} alt="preview" className="w-full h-full object-cover" />
                    ) : m.type === 'embed' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-primary gap-1 px-1">
                        <Icon name="Link" size={20} />
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Ссылка</span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-primary gap-1">
                        <Icon name="Video" size={22} />
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Видео</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {m.type === 'photo' && (
                        <>
                          <button type="button" onClick={() => movePhoto(m, -1)} className="w-7 h-7 flex items-center justify-center bg-card border border-border clip-corner hover:text-primary" aria-label="Левее">
                            <Icon name="ChevronLeft" size={14} />
                          </button>
                          <button type="button" onClick={() => movePhoto(m, 1)} className="w-7 h-7 flex items-center justify-center bg-card border border-border clip-corner hover:text-primary" aria-label="Правее">
                            <Icon name="ChevronRight" size={14} />
                          </button>
                        </>
                      )}
                      <button type="button" onClick={() => removeMedia(m)} className="w-7 h-7 flex items-center justify-center bg-card border border-border clip-corner hover:text-destructive" aria-label="Удалить">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                    {i === 0 && m.type === 'photo' && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-[9px] font-display uppercase tracking-wide clip-corner">Обложка</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <label className={`px-5 py-2.5 bg-muted text-foreground font-display uppercase text-xs tracking-wider clip-corner transition-opacity cursor-pointer ${photos.length >= MAX_PHOTOS ? 'opacity-40 pointer-events-none' : 'hover:opacity-90'}`}>
                <span className="inline-flex items-center gap-2"><Icon name="ImagePlus" size={14} /> Добавить фото</span>
                <input type="file" accept="image/*" multiple onChange={handleAddPhotos} className="hidden" />
              </label>
              <label className="px-5 py-2.5 bg-muted text-foreground font-display uppercase text-xs tracking-wider clip-corner hover:opacity-90 transition-opacity cursor-pointer">
                <span className="inline-flex items-center gap-2"><Icon name="Video" size={14} /> {videos.length ? 'Заменить видео' : 'Добавить видео'}</span>
                <input type="file" accept="video/*" onChange={handleAddVideo} className="hidden" />
              </label>
            </div>

            {/* Видео по ссылке */}
            <div className="flex gap-2 mt-3">
              <input
                type="url"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink(); } }}
                placeholder="Ссылка на видео (YouTube, VK, RuTube)"
                className="flex-1 min-w-0 bg-background border border-border px-4 py-2.5 clip-corner focus:border-primary focus:outline-none transition-colors text-sm"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-5 py-2.5 bg-muted text-foreground font-display uppercase text-xs tracking-wider clip-corner hover:opacity-90 transition-opacity inline-flex items-center gap-2 shrink-0"
              >
                <Icon name="Plus" size={14} /> Добавить {embeds.length > 0 && `(${embeds.length})`}
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground mt-2">
              Фото — до {MAX_PHOTOS} шт. Первое фото становится обложкой. Видео — файл до {MAX_VIDEO_MB} МБ или ссылка на YouTube / VK / RuTube.
            </p>
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
            {!build && (
              <button
                onClick={() => {
                  localStorage.removeItem(DRAFT_KEY);
                  setForm(buildDefault(null));
                  setMedia([]);
                }}
                className="px-7 py-3 border border-border text-muted-foreground font-display uppercase text-sm tracking-wider clip-corner hover:border-destructive/50 hover:text-destructive transition-colors"
              >
                Очистить
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildForm;