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
            <div key={b.id} className="flex-[0_0_100%] min-w-0 px-1">
              <div className="grid md:grid-cols-2 gap-6 items-center bg-card/60 backdrop-blur-sm border border-border clip-corner p-5 md:p-6">
                {/* Фото слева */}
                <div className="relative overflow-hidden clip-corner border border-border">
                  <img src={b.image} alt={b.name} className="w-full h-52 md:h-72 object-cover" />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-background/80 backdrop-blur border border-primary/40 text-primary text-xs font-display tracking-wide">
                    {b.fps}+ FPS
                  </div>
                </div>

                {/* Текст справа */}
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-secondary mb-1">{b.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{b.tagline}</p>

                  <ul className="space-y-2 mb-5">
                    <li className="flex items-center gap-2 text-sm">
                      <Icon name="Cpu" size={16} className="text-primary shrink-0" />
                      <span className="text-muted-foreground">Процессор:</span>
                      <span className="font-display">{b.specs.cpu}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Icon name="MonitorPlay" size={16} className="text-primary shrink-0" />
                      <span className="text-muted-foreground">Видеокарта:</span>
                      <span className="font-display">{b.specs.gpu}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Icon name="MemoryStick" size={16} className="text-primary shrink-0" />
                      <span className="text-muted-foreground">ОЗУ:</span>
                      <span className="font-display">{b.specs.ram}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Icon name="HardDrive" size={16} className="text-primary shrink-0" />
                      <span className="text-muted-foreground">Накопитель:</span>
                      <span className="font-display">{b.specs.storage}</span>
                    </li>
                  </ul>

                  <p className="font-display text-xl md:text-2xl font-bold text-primary mb-4">{fmt(b.price)}</p>

                  <div className="flex flex-wrap gap-3">
                    <Link to="/contacts" className="px-5 py-2.5 bg-primary text-primary-foreground font-display uppercase text-xs tracking-wider clip-corner hover:opacity-90 transition-opacity border-glow-cyan">
                      Нужен этот вариант
                    </Link>
                    <Link to="/contacts" className="px-5 py-2.5 border border-border text-foreground font-display uppercase text-xs tracking-wider clip-corner hover:border-primary/50 transition-colors">
                      Другой вариант
                    </Link>
                  </div>
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