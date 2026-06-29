export interface Build {
  id: number;
  name: string;
  tagline: string;
  price: number;
  image: string;
  accent: 'cyan' | 'magenta';
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    cooling: string;
    psu: string;
  };
  fps: number;
}

export const builds: Build[] = [
  {
    id: 1,
    name: 'CYBER START',
    tagline: 'Идеальный вход в мир киберспорта',
    price: 89990,
    image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/files/292d12b4-a359-411a-af85-245748696e7e.jpg',
    accent: 'cyan',
    fps: 120,
    specs: {
      cpu: 'AMD Ryzen 5 7600',
      gpu: 'RTX 4060 8GB',
      ram: '16 GB DDR5',
      storage: '1 TB NVMe SSD',
      cooling: 'Воздушное',
      psu: '650W Bronze',
    },
  },
  {
    id: 2,
    name: 'NEON PRO',
    tagline: 'Высокий FPS в любой игре на ультра',
    price: 169990,
    image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/files/292d12b4-a359-411a-af85-245748696e7e.jpg',
    accent: 'magenta',
    fps: 200,
    specs: {
      cpu: 'AMD Ryzen 7 7800X3D',
      gpu: 'RTX 4070 Ti 12GB',
      ram: '32 GB DDR5',
      storage: '2 TB NVMe SSD',
      cooling: 'Жидкостное 240мм',
      psu: '850W Gold',
    },
  },
  {
    id: 3,
    name: 'TITAN X',
    tagline: 'Топовая машина без компромиссов',
    price: 329990,
    image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/files/292d12b4-a359-411a-af85-245748696e7e.jpg',
    accent: 'cyan',
    fps: 360,
    specs: {
      cpu: 'Intel Core i9-14900K',
      gpu: 'RTX 4090 24GB',
      ram: '64 GB DDR5',
      storage: '4 TB NVMe SSD',
      cooling: 'Жидкостное 360мм',
      psu: '1200W Platinum',
    },
  },
  {
    id: 4,
    name: 'WHITE STORM',
    tagline: 'Белоснежная сборка для стримов и работы',
    price: 219990,
    image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/502be915-c80c-4f45-a30e-d7b83c85f1f5.jpg',
    accent: 'cyan',
    fps: 240,
    specs: {
      cpu: 'AMD Ryzen 7 7800X3D',
      gpu: 'RTX 4080 Super 16GB',
      ram: '32 GB DDR5',
      storage: '2 TB NVMe SSD',
      cooling: 'Жидкостное 360мм',
      psu: '1000W Gold',
    },
  },
  {
    id: 5,
    name: 'FROST CORE',
    tagline: 'Сбалансированная машина для игр и графики',
    price: 139990,
    image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/502be915-c80c-4f45-a30e-d7b83c85f1f5.jpg',
    accent: 'magenta',
    fps: 165,
    specs: {
      cpu: 'Intel Core i5-14600K',
      gpu: 'RTX 4070 12GB',
      ram: '32 GB DDR5',
      storage: '1 TB NVMe SSD',
      cooling: 'Жидкостное 240мм',
      psu: '750W Gold',
    },
  },
];