import { SITE_URL } from '@/components/SEO';

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'White Friday PC',
  url: SITE_URL,
  logo: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/85b4ce1f-a80b-4f4f-bbc3-300fafd4b67e.png',
  description: 'Сборка игровых и рабочих компьютеров на заказ под ключ. Индивидуальный подбор комплектующих, гарантия до 3 лет от мастерской и до 10 лет на комплектующие, доставка по России и СНГ.',
  telephone: '+7 909 909-95-90',
  email: 'whitefriday.pc@gmail.com',
  sameAs: [
    'https://vk.com/whitefriday_pc',
    'https://t.me/White_Friday_PC',
    'https://www.youtube.com/@WhiteFriday-PC',
  ],
};

export const localBusinessLd = {
  '@context': 'https://schema.org',
  '@type': 'ComputerStore',
  name: 'White Friday PC',
  url: SITE_URL,
  image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/85b4ce1f-a80b-4f4f-bbc3-300fafd4b67e.png',
  telephone: '+7 909 909-95-90',
  email: 'whitefriday.pc@gmail.com',
  priceRange: '₽₽',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Нагатинская улица, дом 28к2',
    addressLocality: 'Москва',
    addressCountry: 'RU',
  },
  openingHours: 'Mo-Su 11:00-21:00',
  sameAs: [
    'https://vk.com/whitefriday_pc',
    'https://t.me/White_Friday_PC',
    'https://www.youtube.com/@WhiteFriday-PC',
  ],
};

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'White Friday PC',
  url: SITE_URL,
};

interface BuildForLd {
  name: string;
  tagline?: string;
  price: number;
  image?: string;
  specs?: { cpu?: string; gpu?: string };
}

export const catalogItemListLd = (builds: BuildForLd[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Каталог сборок ПК White Friday PC',
  itemListElement: builds.map((b, i) => {
    const desc = b.tagline || [b.specs?.cpu, b.specs?.gpu].filter(Boolean).join(', ');
    const product: Record<string, unknown> = {
      '@type': 'Product',
      name: b.name,
      brand: { '@type': 'Brand', name: 'White Friday PC' },
      category: 'Игровые и рабочие компьютеры',
    };
    if (desc) product.description = desc;
    if (b.image && !b.image.startsWith('data:')) product.image = b.image;
    if (b.price > 0) {
      product.offers = {
        '@type': 'Offer',
        price: b.price,
        priceCurrency: 'RUB',
        availability: 'https://schema.org/PreOrder',
        url: `${SITE_URL}/catalog`,
        seller: { '@type': 'Organization', name: 'White Friday PC' },
      };
    }
    return { '@type': 'ListItem', position: i + 1, item: product };
  }),
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});