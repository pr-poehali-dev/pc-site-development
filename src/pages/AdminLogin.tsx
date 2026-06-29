import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { login, needsSetup, setupAdmin } from '@/lib/buildsApi';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isSetup, setIsSetup] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    needsSetup().then((v) => {
      setIsSetup(v);
      setChecking(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSetup) {
        await setupAdmin(username, password, fullName);
      }
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Icon name="Loader" size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-card border border-border clip-corner space-y-5"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto flex items-center justify-center bg-primary text-primary-foreground clip-corner mb-4 border-glow-cyan">
            <Icon name={isSetup ? 'UserPlus' : 'Lock'} size={28} />
          </div>
          <h1 className="font-display text-2xl uppercase tracking-wide">
            {isSetup ? 'Создание админа' : 'Админ-панель'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isSetup ? 'Задайте логин и пароль для входа' : 'White Friday PC'}
          </p>
        </div>

        {error && (
          <div className="px-4 py-3 bg-destructive/10 border border-destructive/40 text-destructive text-sm clip-corner">
            {error}
          </div>
        )}

        {isSetup && (
          <div>
            <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Имя</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        )}

        <div>
          <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Логин</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите логин"
            className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-2 font-display uppercase tracking-wide">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            className="w-full bg-background border border-border px-4 py-3 clip-corner focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-display uppercase tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan disabled:opacity-50"
        >
          {loading ? 'Подождите...' : isSetup ? 'Создать и войти' : 'Войти'}{' '}
          <Icon name={isSetup ? 'UserPlus' : 'LogIn'} size={18} />
        </button>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-display uppercase tracking-wide"
        >
          <Icon name="ArrowLeft" size={16} /> На главную
        </Link>
      </form>
    </div>
  );
};

export default AdminLogin;