import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollTop}
      aria-label="Наверх"
      className={`md:hidden fixed bottom-6 right-4 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-primary text-primary-foreground border-2 border-primary shadow-[0_0_20px_rgba(34,197,94,0.7)] transition-all duration-300 active:scale-90 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <Icon name="ArrowUp" size={28} />
    </button>
  );
};

export default ScrollToTopButton;