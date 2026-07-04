import func2url from '../../backend/func2url.json';
import { getToken } from './buildsApi';

const ARTICLES_URL = func2url.articles;

export interface ApiArticle {
  id: number;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  author: string | null;
  is_published: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ArticleInput = Partial<Omit<ApiArticle, 'id'>> & { id?: number; cover_base64?: string };

export async function fetchArticles(all = false): Promise<ApiArticle[]> {
  const url = all ? `${ARTICLES_URL}?all=1` : ARTICLES_URL;
  const headers: Record<string, string> = {};
  if (all) headers['X-Auth-Token'] = getToken() || '';
  const res = await fetch(url, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка загрузки статей');
  return data.articles || [];
}

export async function fetchArticleBySlug(slug: string): Promise<ApiArticle> {
  const res = await fetch(`${ARTICLES_URL}?slug=${encodeURIComponent(slug)}`, {
    headers: { 'X-Auth-Token': getToken() || '' },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Статья не найдена');
  return data.article;
}

export async function saveArticle(article: ArticleInput) {
  const method = article.id ? 'PUT' : 'POST';
  const res = await fetch(ARTICLES_URL, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() || '' },
    body: JSON.stringify(article),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка сохранения статьи');
  return data.article as ApiArticle;
}

export async function toggleArticlePublished(id: number, is_published: boolean) {
  const res = await fetch(ARTICLES_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() || '' },
    body: JSON.stringify({ id, is_published }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Ошибка изменения видимости');
  }
}

export async function deleteArticle(id: number) {
  const res = await fetch(ARTICLES_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() || '' },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка удаления статьи');
  return data;
}