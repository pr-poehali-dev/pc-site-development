import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import BuildForm from '@/components/admin/BuildForm';
import ArticleForm from '@/components/admin/ArticleForm';
import AdminCreate from '@/components/admin/AdminCreate';
import OrdersTab from '@/components/admin/OrdersTab';
import {
  verifyToken,
  fetchBuilds,
  deleteBuild,
  updateSortOrder,
  togglePublished,
  clearToken,
  type ApiBuild,
} from '@/lib/buildsApi';
import {
  fetchArticles,
  deleteArticle,
  toggleArticlePublished,
  type ApiArticle,
} from '@/lib/articlesApi';

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [builds, setBuilds] = useState<ApiBuild[]>([]);
  const [editing, setEditing] = useState<ApiBuild | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAdminCreate, setShowAdminCreate] = useState(false);
  const [toast, setToast] = useState('');
  const [tab, setTab] = useState<'orders' | 'builds' | 'articles'>('orders');
  const [articles, setArticles] = useState<ApiArticle[]>([]);
  const [editingArticle, setEditingArticle] = useState<ApiArticle | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);

  const load = async () => {
    try {
      const list = await fetchBuilds(true);
      setBuilds(list);
    } catch {
      setBuilds([]);
    }
  };

  const loadArticles = async () => {
    try {
      const list = await fetchArticles(true);
      setArticles(list);
    } catch {
      setArticles([]);
    }
  };

  useEffect(() => {
    (async () => {
      const ok = await verifyToken();
      if (!ok) {
        navigate('/admin/login');
        return;
      }
      await Promise.all([load(), loadArticles()]);
      setLoading(false);
    })();
  }, [navigate]);

  const handleDeleteArticle = async (id: number) => {
    if (!confirm('Удалить эту статью?')) return;
    await deleteArticle(id);
    await loadArticles();
  };

  const handleToggleArticle = async (a: ApiArticle) => {
    const next = !a.is_published;
    setArticles((list) => list.map((x) => (x.id === a.id ? { ...x, is_published: next } : x)));
    try {
      await toggleArticlePublished(a.id, next);
    } catch {
      await loadArticles();
    }
  };

  const openNewArticle = () => {
    setEditingArticle(null);
    setShowArticleForm(true);
  };

  const openEditArticle = (a: ApiArticle) => {
    setEditingArticle(a);
    setShowArticleForm(true);
  };

  const onArticleSaved = async (isNew: boolean) => {
    setShowArticleForm(false);
    setEditingArticle(null);
    await loadArticles();
    setToast(isNew ? 'Статья добавлена!' : 'Изменения сохранены!');
    setTimeout(() => setToast(''), 3500);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту сборку?')) return;
    await deleteBuild(id);
    await load();
  };

  const handleToggle = async (b: ApiBuild) => {
    const next = !b.is_published;
    setBuilds((list) => list.map((x) => (x.id === b.id ? { ...x, is_published: next } : x)));
    try {
      await togglePublished(b.id, next);
    } catch {
      await load();
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= builds.length) return;
    const reordered = [...builds];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    // Оптимистично обновляем UI
    setBuilds(reordered);
    try {
      // Назначаем порядок по позиции в списке
      await Promise.all(
        reordered.map((b, i) =>
          b.sort_order !== i ? updateSortOrder(b.id, i) : Promise.resolve()
        )
      );
    } catch {
      await load();
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login');
  };

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (b: ApiBuild) => {
    setEditing(b);
    setShowForm(true);
  };

  const onSaved = async (isNew: boolean) => {
    setShowForm(false);
    setEditing(null);
    await load();
    setToast(isNew ? 'Сборка успешно добавлена!' : 'Изменения сохранены!');
    setTimeout(() => setToast(''), 3500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Icon name="Loader" size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-6 py-4 bg-green-600 text-white font-display uppercase text-sm tracking-wide clip-corner shadow-lg animate-fade-up">
          <Icon name="CircleCheck" size={20} />
          {toast}
        </div>
      )}
      <header className="border-b border-border bg-card/70 backdrop-blur sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <h1 className="font-display text-xl uppercase tracking-wide">Админ-панель · White Friday PC</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAdminCreate(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 border border-border text-foreground font-display uppercase text-xs tracking-wider clip-corner hover:border-primary/50 transition-colors"
            >
              <Icon name="UserPlus" size={16} /> Админ
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-border text-foreground font-display uppercase text-xs tracking-wider clip-corner hover:border-destructive/50 transition-colors"
            >
              <Icon name="LogOut" size={16} /> Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto">
          <button
            onClick={() => setTab('orders')}
            className={`px-5 py-3 font-display uppercase text-sm tracking-wider transition-colors border-b-2 -mb-px whitespace-nowrap ${
              tab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Заказы
          </button>
          <button
            onClick={() => setTab('builds')}
            className={`px-5 py-3 font-display uppercase text-sm tracking-wider transition-colors border-b-2 -mb-px ${
              tab === 'builds' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Сборки ({builds.length})
          </button>
          <button
            onClick={() => setTab('articles')}
            className={`px-5 py-3 font-display uppercase text-sm tracking-wider transition-colors border-b-2 -mb-px ${
              tab === 'articles' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Статьи ({articles.length})
          </button>
        </div>

        {tab === 'orders' && (
          <OrdersTab onToast={(msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); }} />
        )}

        {tab === 'builds' && (
        <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Конфигурации ({builds.length})</h2>
            <p className="text-muted-foreground text-sm">Стрелками меняйте порядок показа в каруселе</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan"
          >
            <Icon name="Plus" size={18} /> Добавить
          </button>
        </div>

        {builds.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border clip-corner">
            <Icon name="PackageOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Пока нет ни одной конфигурации. Добавьте первую!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {builds.map((b, index) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-card border border-border clip-corner"
              >
                <div className="flex sm:flex-col gap-1 justify-center">
                  <button
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    aria-label="Поднять выше"
                    className="w-8 h-8 flex items-center justify-center border border-border text-foreground clip-corner hover:border-primary/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Icon name="ChevronUp" size={16} />
                  </button>
                  <button
                    onClick={() => handleMove(index, 1)}
                    disabled={index === builds.length - 1}
                    aria-label="Опустить ниже"
                    className="w-8 h-8 flex items-center justify-center border border-border text-foreground clip-corner hover:border-primary/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Icon name="ChevronDown" size={16} />
                  </button>
                </div>
                {b.image_url ? (
                  <img src={b.image_url} alt={b.name} className="w-full sm:w-28 h-20 object-cover clip-corner border border-border" />
                ) : (
                  <div className="w-full sm:w-28 h-20 flex items-center justify-center bg-background border border-border clip-corner text-muted-foreground">
                    <Icon name="Image" size={24} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg font-bold">{b.name}</h3>
                    {!b.is_published && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs clip-corner">Скрыта</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{b.tagline}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    <span className="font-display text-primary">{fmt(b.price)}</span>
                    {b.build_date && (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Icon name="Calendar" size={14} /> {new Date(b.build_date).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(b)}
                    aria-label={b.is_published ? 'Скрыть с сайта' : 'Показать на сайте'}
                    className={`flex items-center gap-1 px-4 py-2 border font-display uppercase text-xs tracking-wider clip-corner transition-colors ${
                      b.is_published
                        ? 'border-green-600/50 text-green-500 hover:border-green-500'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <Icon name={b.is_published ? 'Eye' : 'EyeOff'} size={14} />
                    <span className="hidden md:inline">{b.is_published ? 'Видна' : 'Скрыта'}</span>
                  </button>
                  <button
                    onClick={() => openEdit(b)}
                    className="flex items-center gap-1 px-4 py-2 border border-border text-foreground font-display uppercase text-xs tracking-wider clip-corner hover:border-primary/50 transition-colors"
                  >
                    <Icon name="Pencil" size={14} /> Изменить
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="flex items-center gap-1 px-4 py-2 border border-border text-destructive font-display uppercase text-xs tracking-wider clip-corner hover:border-destructive/50 transition-colors"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}

        {tab === 'articles' && (
        <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Статьи ({articles.length})</h2>
            <p className="text-muted-foreground text-sm">Публикуйте материалы для раздела «Статьи» на сайте</p>
          </div>
          <button
            onClick={openNewArticle}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan"
          >
            <Icon name="Plus" size={18} /> Добавить
          </button>
        </div>

        {articles.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border clip-corner">
            <Icon name="Newspaper" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Пока нет ни одной статьи. Добавьте первую!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((a) => (
              <div
                key={a.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-card border border-border clip-corner"
              >
                {a.cover_url ? (
                  <img src={a.cover_url} alt={a.title} className="w-full sm:w-28 h-20 object-cover clip-corner border border-border" />
                ) : (
                  <div className="w-full sm:w-28 h-20 flex items-center justify-center bg-background border border-border clip-corner text-muted-foreground">
                    <Icon name="Newspaper" size={24} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg font-bold">{a.title}</h3>
                    {!a.is_published && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs clip-corner">Черновик</span>
                    )}
                  </div>
                  {a.excerpt && <p className="text-muted-foreground text-sm line-clamp-2">{a.excerpt}</p>}
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    {a.author && <span>{a.author}</span>}
                    {a.published_at && (
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} /> {new Date(a.published_at).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleArticle(a)}
                    aria-label={a.is_published ? 'Скрыть с сайта' : 'Показать на сайте'}
                    className={`flex items-center gap-1 px-4 py-2 border font-display uppercase text-xs tracking-wider clip-corner transition-colors ${
                      a.is_published
                        ? 'border-green-600/50 text-green-500 hover:border-green-500'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <Icon name={a.is_published ? 'Eye' : 'EyeOff'} size={14} />
                    <span className="hidden md:inline">{a.is_published ? 'Опубл.' : 'Черновик'}</span>
                  </button>
                  <button
                    onClick={() => openEditArticle(a)}
                    className="flex items-center gap-1 px-4 py-2 border border-border text-foreground font-display uppercase text-xs tracking-wider clip-corner hover:border-primary/50 transition-colors"
                  >
                    <Icon name="Pencil" size={14} /> Изменить
                  </button>
                  <button
                    onClick={() => handleDeleteArticle(a.id)}
                    className="flex items-center gap-1 px-4 py-2 border border-border text-destructive font-display uppercase text-xs tracking-wider clip-corner hover:border-destructive/50 transition-colors"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}
      </main>

      {showForm && (
        <BuildForm build={editing} onClose={() => setShowForm(false)} onSaved={onSaved} />
      )}
      {showArticleForm && (
        <ArticleForm article={editingArticle} onClose={() => setShowArticleForm(false)} onSaved={onArticleSaved} />
      )}
      {showAdminCreate && <AdminCreate onClose={() => setShowAdminCreate(false)} />}
    </div>
  );
};

export default Admin;