import type { Build } from '@/data/builds';
import type { ApiBuild } from '@/lib/buildsApi';

const PLACEHOLDER = 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/502be915-c80c-4f45-a30e-d7b83c85f1f5.jpg';

export function apiToBuilds(list: ApiBuild[]): Build[] {
  return list.map((b) => ({
    id: b.id,
    name: b.name,
    tagline: b.tagline || '',
    price: b.price || 0,
    image: b.image_url || PLACEHOLDER,
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
    },
  }));
}