import { useEffect, useRef } from 'react';

interface Props {
  src: string;
  className?: string;
}

// Видео, которое автоматически запускается при попадании в зону видимости
// и ставится на паузу, когда уходит из неё. Зациклено и без звука
// (обязательное условие браузеров для автозапуска).
const AutoPlayVideo = ({ src, className }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        });
      },
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      loop
      muted
      playsInline
      controls
      preload="metadata"
      className={className}
    />
  );
};

export default AutoPlayVideo;
