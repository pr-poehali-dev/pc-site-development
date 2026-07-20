// Превращает ссылку на видео (YouTube / VK / RuTube) во встраиваемый URL для iframe.
// Возвращает null, если ссылка не распознана.

export function toEmbedUrl(raw: string): string | null {
  const url = (raw || '').trim();
  if (!url) return null;

  try {
    // YouTube: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID, /embed/ID
    const yt =
      url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
    if (yt) {
      return `https://www.youtube.com/embed/${yt[1]}`;
    }

    // RuTube: rutube.ru/video/ID/ или rutube.ru/play/embed/ID
    const rt = url.match(/rutube\.ru\/(?:video|play\/embed)\/([\w-]+)/);
    if (rt) {
      return `https://rutube.ru/play/embed/${rt[1]}`;
    }

    // VK: уже готовый embed video_ext.php
    if (url.includes('video_ext.php')) {
      return url;
    }
    // VK: vk.com/video-OID_ID или vkvideo.ru/video-OID_ID
    const vk = url.match(/(?:vk\.com|vkvideo\.ru)\/video(-?\d+)_(\d+)/);
    if (vk) {
      return `https://vk.com/video_ext.php?oid=${vk[1]}&id=${vk[2]}&hd=2`;
    }

    return null;
  } catch {
    return null;
  }
}

export function isEmbedSupported(raw: string): boolean {
  return toEmbedUrl(raw) !== null;
}
