import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import GpuIcon from '@/components/ui/GpuIcon';
import type { Build } from '@/data/builds';

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const BuildsCarousel = ({ builds, onSelect }: { builds: Build[]; onSelect?: (i: number) => void }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selected, setSelected] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const resetAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!emblaApi) return;
    timerRef.current = setInterval(() => emblaApi.scrollNext(), 9000);
  }, [emblaApi]);

  const scrollTo = useCallback((i: number) => { if (emblaApi) emblaApi.scrollTo(i); resetAutoplay(); }, [emblaApi, resetAutoplay]);
  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev(); resetAutoplay(); }, [emblaApi, resetAutoplay]);
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext(); resetAutoplay(); }, [emblaApi, resetAutoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    const handleSelect = () => {
      const i = emblaApi.selectedScrollSnap();
      setSelected(i);
      onSelect?.(i);
    };
    emblaApi.on('select', handleSelect);
    handleSelect();
    resetAutoplay();
    return () => {
      emblaApi.off('select', handleSelect);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [emblaApi, resetAutoplay, onSelect]);

  return (
    <div className="relative" onMouseEnter={stopAutoplay} onMouseLeave={resetAutoplay}>
      <div className="relative z-10 overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {builds.map((b) => (
            <div key={b.id} className="flex-[0_0_100%] min-w-0 px-1">
              <div className="grid md:grid-cols-2 gap-6 items-center bg-card/15 backdrop-blur-md border border-border/50 clip-corner p-5 md:p-6">
                {/* Фото слева */}
                <div className="relative overflow-hidden clip-corner border border-border">
                  <img src={b.image} alt={b.name} className="w-full aspect-[4/3] object-cover" />
                  {b.buildDate && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-background/80 backdrop-blur border border-primary/40 text-primary text-xs font-display tracking-wide flex items-center gap-1">
                      <Icon name="Calendar" size={12} />
                      {new Date(b.buildDate).toLocaleDateString('ru-RU')}
                    </div>
                  )}
                </div>

                {/* Текст справа */}
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-secondary mb-1">{b.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 font-sans">{b.tagline}</p>

                  <ul className="space-y-2.5 mb-5 font-sans">
                    <li className="flex items-center gap-2.5 text-sm">
                      <Icon name="Cpu" size={22} className="text-primary shrink-0" />
                      <span>{b.specs.cpu}</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm">
                      <GpuIcon size={22} className="text-primary" />
                      <span>{b.specs.gpu}</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm">
                      <Icon name="MemoryStick" size={22} className="text-primary shrink-0" />
                      <span>{b.specs.ram}</span>
                    </li>
                  </ul>

                  <div className="mb-4">
                    <p className="font-display text-xl md:text-2xl font-bold text-primary">{fmt(b.price)}</p>
                    <p className="text-muted-foreground text-[11px] font-sans leading-tight">
                      Стоимость указана на момент сборки данной конфигурации
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link to="/contacts" className="px-5 py-2.5 btn-primary font-display uppercase text-xs tracking-wider clip-corner btn-glow-green">
                      Нужен этот вариант
                    </Link>
                    <Link to="/contacts" className="px-5 py-2.5 btn-primary font-display uppercase text-xs tracking-wider clip-corner">
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