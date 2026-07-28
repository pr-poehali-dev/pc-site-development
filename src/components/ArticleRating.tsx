import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { recordArticleView, voteArticle, type ApiArticle } from '@/lib/articlesApi';

const fmt = (n: number) => n.toLocaleString('ru-RU');

const ArticleRating = ({ article }: { article: ApiArticle }) => {
  const { toast } = useToast();
  const [views, setViews] = useState(article.views ?? 0);
  const [likes, setLikes] = useState(article.likes ?? 0);
  const [dislikes, setDislikes] = useState(article.dislikes ?? 0);
  const [myVote, setMyVote] = useState<number | null>(article.my_vote ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLikes(article.likes ?? 0);
    setDislikes(article.dislikes ?? 0);
    setMyVote(article.my_vote ?? null);
    setViews(article.views ?? 0);
  }, [article.id, article.likes, article.dislikes, article.my_vote, article.views]);

  useEffect(() => {
    const key = `wf_viewed_${article.id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    recordArticleView(article.id).then((r) => {
      if (r?.views != null) setViews(r.views);
    });
  }, [article.id]);

  const vote = async (v: 1 | -1) => {
    if (myVote != null || saving) return;
    setSaving(true);
    try {
      const r = await voteArticle(article.id, v);
      setLikes(r.likes);
      setDislikes(r.dislikes);
      setMyVote(r.my_vote ?? v);
      toast({ title: 'Спасибо за оценку!', description: 'Ваш голос учтён.' });
    } catch (e) {
      toast({ title: 'Не получилось', description: e instanceof Error ? e.message : 'Попробуйте ещё раз' });
    } finally {
      setSaving(false);
    }
  };

  const voted = myVote != null;

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Eye" size={16} /> {fmt(views)} просмотров
        </span>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-display uppercase tracking-wide">
            {voted ? 'Ваша оценка' : 'Оцените статью'}
          </span>
          <button
            onClick={() => vote(1)}
            disabled={voted || saving}
            className={`inline-flex items-center gap-2 px-4 py-2 border clip-corner font-display uppercase text-xs tracking-wide transition-colors disabled:cursor-default ${
              myVote === 1
                ? 'border-primary text-primary bg-primary/10'
                : voted
                ? 'border-border text-muted-foreground'
                : 'border-border hover:border-primary/50 hover:text-primary'
            }`}
          >
            <Icon name="ThumbsUp" size={15} /> {fmt(likes)}
          </button>
          <button
            onClick={() => vote(-1)}
            disabled={voted || saving}
            className={`inline-flex items-center gap-2 px-4 py-2 border clip-corner font-display uppercase text-xs tracking-wide transition-colors disabled:cursor-default ${
              myVote === -1
                ? 'border-destructive text-destructive bg-destructive/10'
                : voted
                ? 'border-border text-muted-foreground'
                : 'border-border hover:border-destructive/50 hover:text-destructive'
            }`}
          >
            <Icon name="ThumbsDown" size={15} /> {fmt(dislikes)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleRating;
