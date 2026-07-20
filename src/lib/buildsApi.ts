import func2url from '../../backend/func2url.json';

const AUTH_URL = func2url.auth;
const BUILDS_URL = func2url.builds;

const TOKEN_KEY = 'wf_admin_token';

export type MediaType = 'photo' | 'video' | 'embed';

export interface ApiMedia {
  id?: number;
  url: string;
  media_type: MediaType;
  sort_order?: number;
}

export interface MediaInput {
  url?: string;
  base64?: string;
  media_type: MediaType;
}

export interface ApiBuild {
  id: number;
  name: string;
  tagline: string | null;
  price: number;
  image_url: string | null;
  media?: ApiMedia[];
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

export type BuildInput = Partial<Omit<ApiBuild, 'id' | 'media'>> & {
  image_base64?: string;
  media?: MediaInput[];
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

// Загружает один файл (фото/видео) отдельным запросом, возвращает его URL.
// onProgress получает процент отправки (0–100).
export function uploadMedia(
  base64: string,
  kind: 'photo' | 'video',
  onProgress?: (percent: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', BUILDS_URL);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Auth-Token', getToken() || '');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      let data: { url?: string; error?: string } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* ignore */
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.url) {
        onProgress?.(100);
        resolve(data.url);
      } else {
        reject(new Error(data.error || 'Не удалось загрузить файл'));
      }
    };

    xhr.onerror = () => reject(new Error('Не удалось загрузить файл'));
    xhr.send(JSON.stringify({ action: 'upload', kind, base64 }));
  });
}

async function chunkAction(payload: Record<string, unknown>) {
  const res = await fetch(BUILDS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() || '' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка загрузки видео');
  return data;
}

function fileToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Не удалось прочитать часть видео'));
    reader.readAsDataURL(blob);
  });
}

// Загружает видео частями через бэкенд (обходит лимит размера тела функции), с прогрессом.
export async function uploadVideoChunked(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const CHUNK = 3 * 1024 * 1024; // 3 МБ бинарных на запрос — с запасом под лимит
  const total = Math.ceil(file.size / CHUNK);

  const init = await chunkAction({
    action: 'chunk_init',
    filename: file.name || 'video.mp4',
    content_type: file.type || 'video/mp4',
  });
  const session = init.session as string;

  try {
    for (let i = 0; i < total; i++) {
      const slice = file.slice(i * CHUNK, (i + 1) * CHUNK);
      const b64 = await fileToBase64(slice);
      await chunkAction({
        action: 'chunk_part',
        session,
        part_number: i + 1,
        base64: b64,
      });
      onProgress?.(Math.round(((i + 1) / total) * 95));
    }

    const fin = await chunkAction({
      action: 'chunk_finish',
      session,
      ext: init.ext,
      content_type: init.content_type,
      total,
    });
    onProgress?.(100);
    return fin.url as string;
  } catch (err) {
    chunkAction({ action: 'chunk_abort', session, total }).catch(() => {});
    throw err;
  }
}

export async function updateSortOrder(id: number, sort_order: number) {
  const res = await fetch(BUILDS_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() || '' },
    body: JSON.stringify({ id, sort_order }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Ошибка изменения порядка');
  }
}

export async function togglePublished(id: number, is_published: boolean) {
  const res = await fetch(BUILDS_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() || '' },
    body: JSON.stringify({ id, is_published }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Ошибка изменения видимости');
  }
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