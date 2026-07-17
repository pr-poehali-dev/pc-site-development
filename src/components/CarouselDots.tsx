import { useEffect, useState } from 'react';
import { type CarouselApi } from '@/components/ui/carousel';

const CarouselDots = ({ api, className = '' }: { api: CarouselApi; className?: string }) => {
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setSelected(api.selectedScrollSnap());
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on('select', onSelect);
    api.on('reInit', () => {
      setCount(api.scrollSnapList().length);
      setSelected(api.selectedScrollSnap());
    });
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  if (count <= 1) return null;

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => api?.scrollTo(i)}
          aria-label={`Слайд ${i + 1}`}
          className={`h-2 rounded-full transition-all ${
            i === selected ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/40'
          }`}
        />
      ))}
    </div>
  );
};

export default CarouselDots;
