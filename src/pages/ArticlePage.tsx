import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useArticle, useArticles } from '@/hooks/usePublicData';
import { ArticleDetailSkeleton } from '@/components/skeletons/CardSkeletons';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { data: article, isLoading: loading, isError: error } = useArticle(slug);
  const { data: allArticles = [] } = useArticles();
  const others = allArticles.filter((a) => a.slug !== slug).slice(0, 3);

  const handleShare = async () => {
    const url = window.location.href;
    const title = article?.title || 'Статья White Friday PC';
    if (navigator.share) {
      try {
        await navigator.share({ title, text: article?.excerpt || title, url });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Ссылка скопирована', description: 'Теперь её можно отправить кому угодно.' });
    } catch {
      toast({ title: 'Не удалось скопировать', description: url });
    }
  };

  return (
    <Layout>
      <section className="container py-12 md:py-16 max-w-3xl">
        <Link to="/articles" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <Icon name="ArrowLeft" size={18} /> Все статьи
        </Link>

        {loading ? (
          <ArticleDetailSkeleton />
        ) : error || !article ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-destructive/10 text-destructive clip-corner mb-6">
              <Icon name="FileX" size={32} />
            </div>
            <h1 className="font-display text-2xl uppercase tracking-wide mb-3">Статья не найдена</h1>
            <p className="text-muted-foreground">Возможно, она была удалена или ещё не опубликована.</p>
          </div>
        ) : (
          <article className="animate-fade-up">
            <h1 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-wide mb-4">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              {article.author && (
                <span className="flex items-center gap-1.5">
                  <Icon name="User" size={15} /> {article.author}
                </span>
              )}
              {article.published_at && (
                <span className="flex items-center gap-1.5">
                  <Icon name="Calendar" size={15} />
                  {new Date(article.published_at).toLocaleDateString('ru-RU')}
                </span>
              )}
              <button
                onClick={handleShare}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 border border-border clip-corner hover:border-primary/50 hover:text-primary transition-colors font-display uppercase text-xs tracking-wide"
              >
                <Icon name="Share2" size={15} /> Поделиться
              </button>
            </div>

            {article.cover_url && (
              <img src={article.cover_url} alt={article.title} className="w-full max-h-[420px] object-cover clip-corner border border-border mb-8" />
            )}

            {article.excerpt && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{article.excerpt}</p>
            )}

            <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90">
              {article.content}
            </div>

            {others.length > 0 && (
              <div className="mt-16 pt-10 border-t border-border">
                <h2 className="font-display text-2xl uppercase tracking-wide mb-6">Другие <span className="text-primary text-glow-cyan">статьи</span></h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {others.map((a) => (
                    <Link
                      to={`/articles/${a.slug}`}
                      key={a.id}
                      className="group flex flex-col bg-card border border-border clip-corner overflow-hidden hover:border-primary/40 transition-colors"
                    >
                      {a.cover_url ? (
                        <img src={a.cover_url} alt={a.title} className="w-full h-36 object-cover" />
                      ) : (
                        <div className="w-full h-36 flex items-center justify-center bg-background text-muted-foreground">
                          <Icon name="Newspaper" size={28} />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-display text-lg uppercase tracking-wide mb-2 group-hover:text-primary transition-colors">{a.title}</h3>
                        {a.excerpt && <p className="text-muted-foreground text-sm flex-1 line-clamp-2">{a.excerpt}</p>}
                        <span className="flex items-center gap-1 mt-4 text-primary text-xs font-display uppercase tracking-wide">
                          Читать <Icon name="ArrowRight" size={13} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </section>
    </Layout>
  );
};

export default ArticlePage;