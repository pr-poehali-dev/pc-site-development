import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404: обращение к несуществующему адресу:', location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <Helmet>
        <title>Страница не найдена — 404 | White Friday PC</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="prerender-status-code" content="404" />
      </Helmet>

      <section className="container py-20 md:py-28">
        <div className="max-w-xl mx-auto text-center animate-fade-up">
          <div className="w-20 h-20 mx-auto flex items-center justify-center bg-primary/10 text-primary clip-corner mb-8 border-glow-cyan">
            <Icon name="SearchX" size={40} />
          </div>
          <p className="font-display text-6xl md:text-7xl font-bold text-primary text-glow-cyan mb-4">404</p>
          <h1 className="font-display text-2xl md:text-3xl uppercase tracking-wide mb-4">Страница не найдена</h1>
          <p className="text-muted-foreground mb-8">
            Возможно, адрес введён с ошибкой или страница была удалена. Проверьте ссылку или вернитесь на главную.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity"
            >
              <Icon name="Home" size={16} /> На главную
            </Link>
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border clip-corner hover:border-primary/50 hover:text-primary transition-colors font-display uppercase text-sm tracking-wide"
            >
              <Icon name="Newspaper" size={16} /> В блог
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFoundPage;
