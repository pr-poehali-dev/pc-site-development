import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { createAdmin } from '@/lib/buildsApi';

const AdminCreate = ({ onClose }: { onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Укажите логин и пароль');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await createAdmin(username, password, fullName);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card border border-border clip-corner p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl uppercase tracking-wide">Новый админ</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={24} />
          </button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto flex items-center justify-center bg-primary text-primary-foreground clip-corner mb-4">
              <Icon name="Check" size={28} />
            </div>
            <p className="font-display uppercase tracking-wide mb-4">Админ создан!</p>
            <button
              onClick={onClose}
              className="px-7 py-3 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity"
            >
              Готово
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="px-4 py-3 bg-destructive/10 border border-destructive/40 text-destructive text-sm clip-corner">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Имя</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Имя сотрудника"
                className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Логин</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Пароль</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-7 py-3 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan disabled:opacity-50"
            >
              {saving ? 'Создание...' : 'Создать админа'} <Icon name="UserPlus" size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCreate;
