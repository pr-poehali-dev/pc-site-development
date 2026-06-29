import func2url from '../../backend/func2url.json';

const AUTH_URL = func2url.auth;
const BUILDS_URL = func2url.builds;

const TOKEN_KEY = 'wf_admin_token';

export interface ApiBuild {
  id: number;
  name: string;
  tagline: string | null;
  price: number;
  image_url: string | null;
  build_date: string | null;
  cpu: string | null;
  gpu: string | null;
  motherboard: string | null;
  ram: string | null;
  storage: string | null;
  psu: string | null;
  cpu_cooling: string | null;
  fans: string | null;
  extras: string | null;
  case_model: string | null;
  is_published: boolean;
  sort_order: number;
}

export type BuildInput = Partial<Omit<ApiBuild, 'id'>> & {
  image_base64?: string;
  id?: number;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function login(username: string, password: string) {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка входа');
  setToken(data.token);
  return data;
}

export async function needsSetup(): Promise<boolean> {
  try {
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'needs_setup' }),
    });
    const data = await res.json();
    return !!data.needs_setup;
  } catch {
    return false;
  }
}

export async function setupAdmin(username: string, password: string, full_name: string) {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'setup', username, password, full_name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка настройки');
  return data;
}

export async function verifyToken(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', token }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function createAdmin(new_username: string, new_password: string, full_name: string) {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create_admin', token: getToken(), new_username, new_password, full_name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка создания админа');
  return data;
}

export async function fetchBuilds(all = false): Promise<ApiBuild[]> {
  const url = all ? `${BUILDS_URL}?all=1` : BUILDS_URL;
  const headers: Record<string, string> = {};
  if (all) headers['X-Auth-Token'] = getToken() || '';
  const res = await fetch(url, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');
  return data.builds || [];
}

export async function saveBuild(build: BuildInput) {
  const method = build.id ? 'PUT' : 'POST';
  const res = await fetch(BUILDS_URL, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() || '' },
    body: JSON.stringify(build),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка сохранения');
  return data;
}

export async function deleteBuild(id: number) {
  const res = await fetch(BUILDS_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() || '' },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка удаления');
  return data;
}