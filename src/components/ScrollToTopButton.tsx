import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = height > 0 ? scrolled / height : 0;
      setVisible(ratio >= 0.45);
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
      className={`md:hidden fixed bottom-5 right-5 z-50 w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground border border-primary/60 clip-corner btn-glow-green transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <Icon name="ChevronUp" size={26} />
    </button>
  );
};

export default ScrollToTopButton;
