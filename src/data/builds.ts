export interface Build {
  id: number;
  name: string;
  tagline: string;
  price: number;
  image: string;
  accent: 'cyan' | 'magenta';
  buildDate?: string;
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    cooling: string;
    psu: string;
    motherboard?: string;
    fans?: string;
    caseModel?: string;
    extras?: string;
  };
  fps: number;
}