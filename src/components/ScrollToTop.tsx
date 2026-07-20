import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

const YM_ID = 110887762;
let first = true;

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (first) {
      first = false;
      return;
    }
    window.ym?.(YM_ID, 'hit', pathname + search);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;