import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { saveArticle, type ApiArticle, type ArticleInput } from '@/lib/articlesApi';

interface Props {
  article: ApiArticle | null;
  onClose: () => void;
  onSaved: (isNew: boolean) => void;
}

const inputCls =
  'w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors';
const labelCls = 'block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide';

const buildDefault = (a: ApiArticle | null): ArticleInput => ({
  id: a?.id,
  title: a?.title || '',
  excerpt: a?.excerpt || '',
  content: a?.content || '',
  cover_url: a?.cover_url || '',
  author: a?.author || '',
  is_published: a?.is_published ?? false,
});

const ArticleForm = ({ article, onClose, onSaved }: Props) => {
  const [form, setForm] = useState<ArticleInput>(() => buildDefault(article));
  const [coverPreview, setCoverPreview] = useState(article?.cover_url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof ArticleInput, value: string | boolean) =>
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

  const handleCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setForm((f) => ({ ...f, cover_base64: compressed }));
      setCoverPreview(compressed);
      setError('');
    } catch {
      setError('Не удалось обработать изображение. Попробуйте другое фото.');
    }
  };

  const handleSave = async () => {
    if (!form.title?.trim()) {
      setError('Укажите заголовок статьи');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await saveArticle(form);
      onSaved(!article);
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
            {article ? 'Редактировать статью' : 'Новая статья'}
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
          <div>
            <label className={labelCls}>Заголовок</label>
            <input
              type="text"
              value={form.title || ''}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Например, Как выбрать видеокарту в 2026"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Автор</label>
            <input
              type="text"
              value={form.author || ''}
              onChange={(e) => set('author', e.target.value)}
              placeholder="Имя автора"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Обложка статьи</label>
            <div className="flex items-center gap-4 mb-3">
              {coverPreview ? (
                <img src={coverPreview} alt="preview" className="w-28 h-20 object-cover clip-corner border border-border" />
              ) : (
                <div className="w-28 h-20 flex items-center justify-center bg-background border border-border clip-corner text-muted-foreground">
                  <Icon name="Image" size={24} />
                </div>
              )}
              <label className="px-5 py-2.5 bg-muted text-foreground font-display uppercase text-xs tracking-wider clip-corner hover:opacity-90 transition-opacity cursor-pointer">
                Загрузить файл
                <input type="file" accept="image/*" onChange={handleCover} className="hidden" />
              </label>
            </div>
            <input
              type="text"
              value={form.cover_url || ''}
              onChange={(e) => {
                set('cover_url', e.target.value);
                setForm((f) => ({ ...f, cover_base64: undefined }));
                setCoverPreview(e.target.value);
              }}
              placeholder="или вставьте ссылку https://..."
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Краткое описание</label>
            <textarea
              rows={2}
              value={form.excerpt || ''}
              onChange={(e) => set('excerpt', e.target.value)}
              placeholder="1–2 предложения для превью в списке статей"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className={labelCls}>Текст статьи</label>
            <textarea
              rows={10}
              value={form.content || ''}
              onChange={(e) => set('content', e.target.value)}
              placeholder="Полный текст статьи..."
              className={`${inputCls} resize-y`}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.is_published}
              onChange={(e) => set('is_published', e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span className="font-display uppercase text-sm tracking-wide">Опубликовать на сайте</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan disabled:opacity-60"
            >
              {saving ? <Icon name="Loader" size={18} className="animate-spin" /> : <Icon name="Save" size={18} />}
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-border text-foreground font-display uppercase text-sm tracking-wider clip-corner hover:border-primary/50 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleForm;