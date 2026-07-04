import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { fetchArticleBySlug, type ApiArticle } from '@/lib/articlesApi';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ApiArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    fetchArticleBySlug(slug)
      .then(setArticle)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <Layout>
      <section className="container py-12 md:py-16 max-w-3xl">
        <Link to="/articles" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <Icon name="ArrowLeft" size={18} /> Все статьи
        </Link>

        {loading ? (
          <div className="flex justify-center py-20">
            <Icon name="Loader" size={32} className="text-primary animate-spin" />
          </div>
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
          </article>
        )}
      </section>
    </Layout>
  );
};

export default ArticlePage;
