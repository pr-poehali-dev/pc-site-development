import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { ReactNode, useState } from 'react';

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/catalog', label: 'Наши сборки' },
  { to: '/reviews', label: 'Отзывы' },
  { to: '/faq', label: 'Вопрос-ответ' },
  { to: '/contacts', label: 'Контакты и доставка' },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container flex items-center justify-between h-16">

          {/* Логотип */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/809fef97-d746-42c7-a1bf-f4bb8df4fd3e.jpg"
              alt="White Friday PC"
              className="h-9 w-9 object-contain rounded-sm"
            />
            <span className="font-display text-xl font-bold tracking-widest text-secondary hidden sm:block">
              WHITE<span className="text-primary">FRIDAY</span>
              <span className="text-muted-foreground text-sm font-normal ml-2">PC</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 font-display uppercase text-sm tracking-wider transition-colors ${
                  location.pathname === item.to
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/contacts"
              className="hidden md:flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan"
            >
              <Icon name="MessageCircle" size={16} />
              Заказать
            </Link>
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
            <div className="p-4">
              <Link
                to="/contacts"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner"
              >
                <Icon name="MessageCircle" size={16} />
                Заказать
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="container py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            {/* Широкий логотип в подвале */}
            <img
              src="https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/a23410fd-5997-4866-a911-e0492eb4b0f6.png"
              alt="White Friday PC"
              className="h-10 object-contain mb-4"
            />
            <p className="text-muted-foreground max-w-sm">
              Собираем игровые и рабочие ПК с душой. Каждая сборка — произведение инженерного искусства.
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
              <li className="flex items-center gap-2"><Icon name="Mail" size={16} className="text-primary" /> hello@whitefriday.ru</li>
              <li className="flex items-center gap-2"><Icon name="MapPin" size={16} className="text-primary" /> Москва, ул. Кибер, 1</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-6 text-center text-muted-foreground text-sm">
          © 2026 White Friday PC. Все права защищены.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
