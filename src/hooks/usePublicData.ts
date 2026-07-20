import { useQuery } from '@tanstack/react-query';
import { fetchBuilds } from '@/lib/buildsApi';
import { apiToBuilds } from '@/lib/buildsMap';
import { fetchArticles, fetchArticleBySlug } from '@/lib/articlesApi';
import type { Build } from '@/data/builds';

export function useBuilds() {
  return useQuery<Build[]>({
    queryKey: ['builds', 'public'],
    queryFn: async () => {
      const list = await fetchBuilds();
      return list.length > 0 ? apiToBuilds(list) : [];
    },
  });
}

export function useArticles() {
  return useQuery({
    queryKey: ['articles', 'public'],
    queryFn: () => fetchArticles(false),
  });
}

export function useArticle(slug: string | undefined) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchArticleBySlug(slug as string),
    enabled: !!slug,
  });
}
