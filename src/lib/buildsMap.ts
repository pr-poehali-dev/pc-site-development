import type { Build } from '@/data/builds';
import type { ApiBuild } from '@/lib/buildsApi';

const PLACEHOLDER = 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/502be915-c80c-4f45-a30e-d7b83c85f1f5.jpg';

export function apiToBuilds(list: ApiBuild[]): Build[] {
  return list.map((b) => {
    const media = (b.media || []).map((m) => ({
      url: m.url,
      type:
        m.media_type === 'video'
          ? ('video' as const)
          : m.media_type === 'embed'
          ? ('embed' as const)
          : ('photo' as const),
    }));
    const firstPhoto = media.find((m) => m.type === 'photo')?.url;
    return {
    id: b.id,
    name: b.name,
    tagline: b.tagline || '',
    price: b.price || 0,
    image: firstPhoto || b.image_url || PLACEHOLDER,
    media: media.length > 0 ? media : (b.image_url ? [{ url: b.image_url, type: 'photo' as const }] : []),
    accent: 'cyan' as const,
    fps: 0,
    buildDate: b.build_date || '',
    specs: {
      cpu: b.cpu || '—',
      gpu: b.gpu || '—',
      ram: b.ram || '—',
      storage: b.storage || '—',
      cooling: b.cpu_cooling || '—',
      psu: b.psu || '—',
      motherboard: b.motherboard || '—',
      fans: b.fans || '',
      caseModel: b.case_model || '',
      extras: b.extras || '',
    },
    };
  });
}