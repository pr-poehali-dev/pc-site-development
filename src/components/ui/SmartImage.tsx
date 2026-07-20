import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Класс для обёртки (задаёт соотношение сторон/размеры) */
  wrapperClassName?: string;
  /** true для изображений на первом экране — грузятся с приоритетом */
  eager?: boolean;
}

const SmartImage = ({
  src,
  alt,
  className,
  wrapperClassName,
  eager = false,
  ...props
}: SmartImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('relative overflow-hidden bg-muted/20', wrapperClassName)}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-muted/30" />}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={cn(
          'transition-opacity duration-500 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
        {...props}
      />
    </div>
  );
};

export default SmartImage;
