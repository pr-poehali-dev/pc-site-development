import { SITE_URL } from '@/components/SEO';

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'White Friday PC',
  url: SITE_URL,
  logo: 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/85b4ce1f-a80b-4f4f-bbc3-300fafd4b67e.png',
  description: 'Сборка игровых и рабочих компьютеров на заказ под ключ. Индивидуальный подбор комплектующих, гарантия до 3 лет.',
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
  openingHours: 'Mo-Su 12:00-21:00',
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
