import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import type { Build } from '@/data/builds';

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const BuildsCarousel = ({ builds }: { builds: Build[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selected, setSelected] = useState(0);

  const scrollTo = useCallback((i: number) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {builds.map((b) => (
            <div key={b.id} className="flex-[0_0_100%] min-w-0">
              <div className="grid lg:grid-cols-2 gap-8 items-center bg-card/60 backdrop-blur-sm border border-border clip-corner p-6 md:p-10">
                {/* Левая часть — характеристики */}
                <div className="order-2 lg:order-1">
                  <div className="inline-block px-3 py-1 mb-4 bg-primary/10 border border-primary/40 text-primary text-sm font-display tracking-wide">
                    {b.fps}+ FPS
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">{b.name}</h3>
                  <p className="text-muted-foreground mb-6">{b.tagline}</p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary clip-corner shrink-0">
                        <Icon name="Cpu" size={18} />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wide">Процессор</p>
                        <p className="font-display">{b.specs.cpu}</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary clip-corner shrink-0">
                        <Icon name="MonitorPlay" size={18} />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wide">Видеокарта</p>
                        <p className="font-display">{b.specs.gpu}</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary clip-corner shrink-0">
                        <Icon name="MemoryStick" size={18} />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wide">Оперативная память</p>
                        <p className="font-display">{b.specs.ram}</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary clip-corner shrink-0">
                        <Icon name="HardDrive" size={18} />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wide">Накопитель</p>
                        <p className="font-display">{b.specs.storage}</p>
                      </div>
                    </li>
                  </ul>

                  <div className="flex flex-wrap items-center gap-4">
                    <span className="font-display text-2xl md:text-3xl font-bold text-primary">{fmt(b.price)}</span>
                    <Link to="/contacts" className="px-6 py-3 bg-primary text-primary-foreground font-display uppercase text-sm tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan">
                      Нужен этот вариант
                    </Link>
                    <Link to="/contacts" className="px-6 py-3 border border-border text-foreground font-display uppercase text-sm tracking-wider clip-corner hover:border-primary/50 transition-colors">
                      Другой вариант
                    </Link>
                  </div>
                </div>

                {/* Правая часть — фото */}
                <div className="order-1 lg:order-2 relative overflow-hidden clip-corner border border-border">
                  <img src={b.image} alt={b.name} className="w-full h-64 md:h-96 object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Стрелки */}
      <button
        onClick={scrollPrev}
        aria-label="Назад"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur border border-border text-foreground hover:text-primary hover:border-primary/50 transition-colors clip-corner z-10"
      >
        <Icon name="ChevronLeft" size={22} />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Вперёд"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur border border-border text-foreground hover:text-primary hover:border-primary/50 transition-colors clip-corner z-10"
      >
        <Icon name="ChevronRight" size={22} />
      </button>

      {/* Точки */}
      <div className="flex justify-center gap-2 mt-6">
        {builds.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Слайд ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              selected === i ? 'w-8 bg-primary' : 'w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BuildsCarousel;
