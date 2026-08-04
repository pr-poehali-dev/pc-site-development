import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import Icon from '@/components/ui/icon';
import { type ApiArticle } from '@/lib/articlesApi';
import { useArticles } from '@/hooks/usePublicData';
import { ArticlesGridSkeleton } from '@/components/skeletons/CardSkeletons';
import SmartImage from '@/components/ui/SmartImage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import CarouselDots from '@/components/CarouselDots';
import { useIsMobile } from '@/hooks/use-mobile';
import { breadcrumbLd } from '@/data/seo';

const Articles = () => {
  const { data: articles = [], isLoading: loading } = useArticles();
  const isMobile = useIsMobile();
  const [articlesApi, setArticlesApi] = useState<CarouselApi>();

  return (
    <Layout>
      <SEO
        title="Блог о сборке ПК и комплектующих — статьи и гайды | White Friday PC"
        description="Полезные статьи и гайды о выборе комплектующих, сборке компьютеров и апгрейде. Разбираемся, какое железо выбрать под игры и работу в 2026 году."
        path="/articles"
        jsonLd={breadcrumbLd([
          { name: 'Главная', path: '/' },
          { name: 'Статьи', path: '/articles' },
        ])}
      />
      <section className="grid-bg border-b border-border">
        <div className="container py-12 md:py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Блог</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold">СТАТЬИ <span className="text-primary text-glow-cyan">И ГАЙДЫ</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Полезные материалы о сборках, комплектующих и апгрейдах от команды White Friday PC.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        {loading ? (
          <ArticlesGridSkeleton count={6} />
        ) : articles.length === 0 ? (
          <div className="max-w-xl mx-auto text-center p-10 md:p-14 bg-card border border-border clip-corner animate-fade-up">
            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-primary/10 text-primary clip-corner mb-6 border-glow-cyan">
              <Icon name="Hammer" size={32} />
            </div>
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wide mb-3">Раздел в разработке</h2>
            <p className="text-muted-foreground">
              Мы готовим для вас интересные статьи и гайды. Совсем скоро здесь появятся первые материалы — загляните позже!
            </p>
          </div>
        ) : (
          (() => {
            const articleCard = (a: ApiArticle) => (
              <Link
                to={`/articles/${a.slug}`}
                className="group flex flex-col h-full bg-card border border-border clip-corner overflow-hidden hover:border-primary/40 transition-colors"
              >
                {a.cover_url ? (
                  <SmartImage src={a.cover_url} alt={a.title} wrapperClassName="w-full h-44" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-44 flex items-center justify-center bg-background text-muted-foreground">
                    <Icon name="Newspaper" size={32} />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl uppercase tracking-wide mb-2 group-hover:text-primary transition-colors">{a.title}</h3>
                  {a.excerpt && <p className="text-muted-foreground text-sm flex-1">{a.excerpt}</p>}
                  <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Icon name="Eye" size={13} /> {(a.views ?? 0).toLocaleString('ru-RU')}</span>
                    <span className="flex items-center gap-1"><Icon name="ThumbsUp" size={13} /> {a.likes ?? 0}</span>
                    <span className="flex items-center gap-1"><Icon name="ThumbsDown" size={13} /> {a.dislikes ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {a.author && <span>{a.author}</span>}
                      {a.published_at && (
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={13} />
                          {new Date(a.published_at).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-primary font-display uppercase tracking-wide">
                      Читать <Icon name="ArrowRight" size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
            return (
              <>
                {!isMobile && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((a, i) => (
                      <div key={a.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 5) * 0.08}s` }}>
                        {articleCard(a)}
                      </div>
                    ))}
                  </div>
                )}
                {isMobile && (
                  <Carousel setApi={setArticlesApi} opts={{ align: 'start' }}>
                    <CarouselContent>
                      {articles.map((a) => (
                        <CarouselItem key={a.id}>{articleCard(a)}</CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselDots api={articlesApi} className="mt-6" />
                  </Carousel>
                )}
              </>
            );
          })()
        )}
      </section>
    </Layout>
  );
};

export default Articles;