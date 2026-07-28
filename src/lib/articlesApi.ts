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
  views?: number;
  likes?: number;
  dislikes?: number;
  my_vote?: number | null;
}

export type ArticleInput = Partial<Omit<ApiArticle, 'id'>> & { id?: number; cover_base64?: string };

const VISITOR_KEY = 'wf_visitor_id';

export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = (crypto.randomUUID?.() || `v_${Date.now()}_${Math.random().toString(36).slice(2)}`).slice(0, 64);
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

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
  const visitor = getVisitorId();
  const res = await fetch(
    `${ARTICLES_URL}?slug=${encodeURIComponent(slug)}&visitor_id=${encodeURIComponent(visitor)}`,
    { headers: { 'X-Auth-Token': getToken() || '' } },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Статья не найдена');
  return data.article;
}

export interface VoteResult {
  likes: number;
  dislikes: number;
  my_vote?: number | null;
  views?: number;
  already?: boolean;
}

export async function recordArticleView(id: number): Promise<VoteResult | null> {
  try {
    const res = await fetch(ARTICLES_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view', id }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function voteArticle(id: number, vote: 1 | -1): Promise<VoteResult> {
  const res = await fetch(ARTICLES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'vote', id, vote, visitor_id: getVisitorId() }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Не удалось сохранить оценку');
  return data;
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