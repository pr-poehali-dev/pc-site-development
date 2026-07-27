import { SITE_URL } from '@/components/SEO';

export const COMPANY_INN = '772585008234';
export const COMPANY_OGRNIP = '324774600026339';
export const COMPANY_LEGAL_NAME = 'ИП Киргизова Анастасия Владимировна';
export const COMPANY_PHONE = '+79099099590';

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'White Friday PC',
  legalName: COMPANY_LEGAL_NAME,
  url: SITE_URL,
  logo: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/85b4ce1f-a80b-4f4f-bbc3-300fafd4b67e.png',
  description: 'Сборка игровых и рабочих компьютеров на заказ под ключ. Индивидуальный подбор комплектующих, гарантия до 3 лет от мастерской и до 10 лет на комплектующие, доставка по России и СНГ.',
  telephone: COMPANY_PHONE,
  email: 'whitefriday.pc@gmail.com',
  taxID: COMPANY_INN,
  vatID: COMPANY_INN,
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'ИНН', value: COMPANY_INN },
    { '@type': 'PropertyValue', propertyID: 'ОГРНИП', value: COMPANY_OGRNIP },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Нагатинская улица, дом 28к2',
    addressLocality: 'Москва',
    addressCountry: 'RU',
  },
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
  legalName: COMPANY_LEGAL_NAME,
  url: SITE_URL,
  image: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/85b4ce1f-a80b-4f4f-bbc3-300fafd4b67e.png',
  telephone: COMPANY_PHONE,
  email: 'whitefriday.pc@gmail.com',
  taxID: COMPANY_INN,
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'ИНН', value: COMPANY_INN },
    { '@type': 'PropertyValue', propertyID: 'ОГРНИП', value: COMPANY_OGRNIP },
  ],
  priceRange: '₽₽',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Нагатинская улица, дом 28к2',
    addressLocality: 'Москва',
    addressCountry: 'RU',
  },
  openingHours: 'Mo-Su 11:00-21:00',
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '55.676605',
    longitude: '37.657341',
  },
  hasMap: 'https://yandex.ru/maps/?pt=37.657341,55.676605&z=17',
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

export const aggregateRatingLd = (reviews: { rating: number }[]) => {
  const rated = reviews.filter((r) => r.rating > 0);
  const count = rated.length || reviews.length;
  const avg = rated.length
    ? rated.reduce((s, r) => s + r.rating, 0) / rated.length
    : 5;
  return {
    '@type': 'AggregateRating',
    ratingValue: (Math.round(avg * 10) / 10).toFixed(1),
    reviewCount: String(count),
    bestRating: '5',
    worstRating: '1',
  };
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