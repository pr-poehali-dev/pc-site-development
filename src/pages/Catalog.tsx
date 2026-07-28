import { useRef, useState } from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import { useBuilds } from '@/hooks/usePublicData';
import { BuildsGridSkeleton } from '@/components/skeletons/CardSkeletons';
import CatalogCard from '@/components/CatalogCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import CarouselDots from '@/components/CarouselDots';
import { breadcrumbLd, catalogItemListLd } from '@/data/seo';

const Catalog = () => {
  const { data: builds = [], isLoading, isError, refetch } = useBuilds();
  const [buildsApi, setBuildsApi] = useState<CarouselApi>();
  const [showAll, setShowAll] = useState(false);
  const gridTopRef = useRef<HTMLDivElement>(null);

  const toggleShowAll = () => {
    setShowAll((v) => {
      if (v) gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return !v;
    });
  };

  return (
    <Layout>
      <SEO
        title="Каталог готовых сборок ПК — купить игровой компьютер | White Friday PC"
        description="Каталог собранных игровых и рабочих компьютеров с ценами и характеристиками. Любую сборку меняем под ваши задачи. Гарантия до 3 лет от мастерской и до 10 лет на комплектующие, доставка по России и СНГ."
        path="/catalog"
        jsonLd={[
          breadcrumbLd([
            { name: 'Главная', path: '/' },
            { name: 'Каталог', path: '/catalog' },
          ]),
          ...(builds.length > 0 ? [catalogItemListLd(builds)] : []),
        ]}
      />
      <section className="grid-bg border-b border-border">
        <div className="container py-12 md:py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Каталог</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold">НАШИ <span className="text-primary text-glow-cyan">ПРОЕКТЫ</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            На данной странице вы можете ознакомиться с нашими работами. Тут представлены заказы наших клиентов с точным перечнем характеристик, итоговым внешним видом и ценой на момент заказа. Возможно, что-то из этих решений вам понравится и вы сможете опереться на эти готовые работы, чтобы вам было проще визуализировать ваш будущий ПК!
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        {isLoading ? (
          <BuildsGridSkeleton count={6} />
        ) : isError ? (
          <div className="flex flex-col items-center text-center gap-4 py-16">
            <div className="w-14 h-14 flex items-center justify-center bg-destructive/10 text-destructive clip-corner">
              <Icon name="WifiOff" size={28} />
            </div>
            <p className="font-display text-xl uppercase tracking-wide">Не удалось загрузить сборки</p>
            <p className="text-muted-foreground text-sm max-w-md">Проверьте соединение с интернетом и попробуйте ещё раз.</p>
            <button onClick={() => refetch()} className="inline-flex items-center gap-2 px-6 py-3 btn-primary font-display uppercase tracking-wider clip-corner">
              <Icon name="RotateCw" size={18} /> Обновить
            </button>
          </div>
        ) : builds.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-3 py-16 text-muted-foreground">
            <Icon name="PackageOpen" size={40} />
            <p className="font-display text-lg uppercase tracking-wide">Сборок пока нет</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <div ref={gridTopRef} className="scroll-mt-28 grid md:grid-cols-3 gap-6 items-stretch">
                {builds.slice(0, 6).map((b, i) => (
                  <CatalogCard key={b.id} build={b} index={i} />
                ))}
              </div>

              {builds.length > 6 && (
                <div
                  className="grid transition-[grid-template-rows] duration-700 ease-in-out"
                  style={{ gridTemplateRows: showAll ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <div className="grid md:grid-cols-3 gap-6 items-stretch pt-6">
                      {builds.slice(6).map((b, i) => (
                        <CatalogCard key={b.id} build={b} index={i + 6} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {builds.length > 6 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={toggleShowAll}
                    className="flex items-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green"
                  >
                    {showAll ? 'Свернуть' : `Показать все компьютеры (${builds.length})`}
                    <Icon name={showAll ? 'ChevronUp' : 'ChevronDown'} size={18} />
                  </button>
                </div>
              )}
            </div>
            <Carousel setApi={setBuildsApi} opts={{ align: 'start' }} className="md:hidden">
              <CarouselContent>
                {builds.map((b, i) => (
                  <CarouselItem key={b.id}>
                    <CatalogCard build={b} index={i} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots api={buildsApi} className="mt-6" />
            </Carousel>
          </>
        )}

        <div className="mt-12 text-center">
          <Link to="/build" className="inline-flex items-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner">
            <Icon name="Wrench" size={18} /> Собрать индивидуальную конфигурацию
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;