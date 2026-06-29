import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { ReactNode, useState } from 'react';

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/catalog', label: 'Сборки' },
  { to: '/compare', label: 'Сравнение' },
  { to: '/contacts', label: 'Контакты' },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 flex items-center justify-center bg-primary clip-corner border-glow-cyan">
              <Icon name="Cpu" size={20} className="text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold tracking-widest text-primary text-glow-cyan">
              NEON<span className="text-secondary text-glow-magenta">RIG</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 font-display uppercase text-sm tracking-wider transition-colors ${
                  location.pathname === item.to
                    ? 'text-primary text-glow-cyan'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 px-5 py-2 bg-secondary text-secondary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-magenta">
              <Icon name="ShoppingCart" size={16} />
              Корзина
            </button>
            <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
              <Icon name={open ? 'X' : 'Menu'} size={28} />
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block px-6 py-4 font-display uppercase tracking-wider border-b border-border ${
                  location.pathname === item.to ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="container py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <span className="font-display text-2xl font-bold tracking-widest text-primary">
              NEON<span className="text-secondary">RIG</span>
            </span>
            <p className="text-muted-foreground mt-3 max-w-sm">
              Собираем игровые и рабочие станции мечты. Каждая сборка — произведение инженерного искусства.
            </p>
          </div>
          <div>
            <h4 className="font-display uppercase tracking-wider text-foreground mb-4">Навигация</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display uppercase tracking-wider text-foreground mb-4">Контакты</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2"><Icon name="Phone" size={16} className="text-primary" /> 8 800 555-35-35</li>
              <li className="flex items-center gap-2"><Icon name="Mail" size={16} className="text-primary" /> hello@neonrig.ru</li>
              <li className="flex items-center gap-2"><Icon name="MapPin" size={16} className="text-primary" /> Москва, ул. Кибер, 1</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-6 text-center text-muted-foreground text-sm">
          © 2026 NEONRIG. Все права защищены.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
