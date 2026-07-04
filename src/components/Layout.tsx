import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { ReactNode, useState } from 'react';

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/catalog', label: 'Наши проекты' },
  { to: '/build', label: 'Собери свой ПК' },
  { to: '/articles', label: 'Статьи' },
  { to: '/reviews', label: 'Отзывы' },
  { to: '/faq', label: 'Вопрос-ответ' },
  { to: '/contacts', label: 'Контакты и доставка' },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-border overflow-hidden" style={{ backgroundColor: 'hsl(0 0% 53%)' }}>
        <div className="container flex items-center justify-between h-20">

          {/* Логотип */}
          <Link to="/" className="flex flex-1 items-center group min-w-0 overflow-hidden">
            <img
              src="https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/85b4ce1f-a80b-4f4f-bbc3-300fafd4b67e.png"
              alt="White Friday PC"
              className="h-32 sm:h-36 w-auto object-contain object-left -my-8 -ml-6 sm:-ml-12"
            />
          </Link>

          <nav className="hidden md:flex items-center justify-center gap-1 shrink-0 px-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-2 lg:px-3 py-2 font-display uppercase text-xs lg:text-sm tracking-wider whitespace-nowrap transition-colors ${
                  location.pathname === item.to
                    ? 'text-white'
                    : 'text-black/70 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 min-w-0 justify-end items-center gap-3 pl-2">
            <div className="hidden xl:flex items-center gap-3">
              <a href="https://vk.com/whitefriday_pc" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте" className="text-black/70 hover:text-white transition-colors">
                <Icon name="MessagesSquare" size={24} />
              </a>
              <a href="https://t.me/White_Friday_PC" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-black/70 hover:text-white transition-colors">
                <Icon name="Send" size={24} />
              </a>
              <a href="https://www.youtube.com/@WhiteFriday-PC" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-black/70 hover:text-white transition-colors">
                <Icon name="Youtube" size={24} />
              </a>
            </div>
            <Link
              to="/contacts"
              className="hidden md:flex items-center gap-2 px-3.5 py-2 btn-primary font-display uppercase text-sm tracking-wider clip-corner btn-glow-green whitespace-nowrap"
            >
              <Icon name="MessageCircle" size={16} />
              Заказать
            </Link>
            <div className="flex md:hidden items-center gap-3 shrink-0">
              <a href="https://vk.com/whitefriday_pc" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте" className="text-black/70 hover:text-white transition-colors">
                <Icon name="MessagesSquare" size={20} />
              </a>
              <a href="https://t.me/White_Friday_PC" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-black/70 hover:text-white transition-colors">
                <Icon name="Send" size={20} />
              </a>
              <a href="https://www.youtube.com/@WhiteFriday-PC" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-black/70 hover:text-white transition-colors">
                <Icon name="Youtube" size={20} />
              </a>
              <button className="text-white" onClick={() => setOpen(!open)}>
                <Icon name={open ? 'X' : 'Menu'} size={26} />
              </button>
            </div>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t border-black/20 backdrop-blur-xl" style={{ backgroundColor: 'hsl(0 0% 53%)' }}>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block px-6 py-4 font-display uppercase tracking-wider border-b border-black/20 ${
                  location.pathname === item.to ? 'text-white' : 'text-black/70'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="p-4">
              <Link
                to="/contacts"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-3 btn-primary font-display uppercase text-sm tracking-wider clip-corner btn-glow-green"
              >
                <Icon name="MessageCircle" size={16} />
                Заказать
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-black/20" style={{ backgroundColor: 'hsl(0 0% 53%)' }}>
        <div className="container py-6 grid md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <div className="h-16 max-w-sm overflow-hidden flex items-center">
              <img
                src="https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/85b4ce1f-a80b-4f4f-bbc3-300fafd4b67e.png"
                alt="White Friday PC"
                className="w-auto h-full object-contain object-left origin-left scale-[2]"
              />
            </div>
            <p className="text-black/80 max-w-sm mt-2">
              Собираем игровые и рабочие ПК с душой. Каждая сборка — произведение инженерного искусства.
            </p>
            <ul className="space-y-2 mt-4 text-black/80">
              <li>
                <a href="https://vk.com/whitefriday_pc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Icon name="MessagesSquare" size={16} className="text-white shrink-0" /> Наш ВК
                </a>
              </li>
              <li>
                <a href="https://t.me/White_Friday_PC" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Icon name="Send" size={16} className="text-white shrink-0" /> Наш Телеграмм канал
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@WhiteFriday-PC" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Icon name="Youtube" size={16} className="text-white shrink-0" /> Наш YouTube канал
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display uppercase tracking-wider text-white mb-4">Навигация</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-black/80 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display uppercase tracking-wider text-white mb-4">Контакты</h4>
            <ul className="space-y-2 text-black/80">
              <li>
                <a href="tel:+79099099590" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Icon name="Phone" size={16} className="text-white shrink-0" /> 8 909 909-95-90
                </a>
              </li>
              <li>
                <a href="mailto:whitefriday.pc@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Icon name="Mail" size={16} className="text-white shrink-0" /> whitefriday.pc@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="MapPin" size={16} className="text-white shrink-0" /> Нагатинская ул., дом 28к2
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-black/20 py-3 flex items-center justify-center gap-2 text-black/70 text-sm">
          <span>© 2026 White Friday PC. Все права защищены.</span>
          <Link to="/admin" aria-label="Вход для администратора" className="text-black/30 hover:text-white transition-colors">
            <Icon name="Lock" size={13} />
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Layout;