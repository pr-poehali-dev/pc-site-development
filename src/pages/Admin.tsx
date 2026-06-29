import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import BuildForm from '@/components/admin/BuildForm';
import AdminCreate from '@/components/admin/AdminCreate';
import {
  verifyToken,
  fetchBuilds,
  deleteBuild,
  clearToken,
  type ApiBuild,
} from '@/lib/buildsApi';

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [builds, setBuilds] = useState<ApiBuild[]>([]);
  const [editing, setEditing] = useState<ApiBuild | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAdminCreate, setShowAdminCreate] = useState(false);

  const load = async () => {
    try {
      const list = await fetchBuilds(true);
      setBuilds(list);
    } catch {
      setBuilds([]);
    }
  };

  useEffect(() => {
    (async () => {
      const ok = await verifyToken();
      if (!ok) {
        navigate('/admin/login');
        return;
      }
      await load();
      setLoading(false);
    })();
  }, [navigate]);

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту сборку?')) return;
    await deleteBuild(id);
    await load();
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

  const onSaved = async () => {
    setShowForm(false);
    setEditing(null);
    await load();
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Конфигурации ({builds.length})</h2>
            <p className="text-muted-foreground text-sm">Управление сборками на сайте</p>
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
            {builds.map((b) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-card border border-border clip-corner"
              >
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
      </main>

      {showForm && (
        <BuildForm build={editing} onClose={() => setShowForm(false)} onSaved={onSaved} />
      )}
      {showAdminCreate && <AdminCreate onClose={() => setShowAdminCreate(false)} />}
    </div>
  );
};

export default Admin;
