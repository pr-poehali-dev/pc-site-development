import { useState } from 'react';
import Icon from '@/components/ui/icon';
import SmartImage from '@/components/ui/SmartImage';
import ImageLightbox from '@/components/ImageLightbox';
import { toEmbedUrl } from '@/lib/videoEmbed';
import type { Build, BuildMedia } from '@/data/builds';

interface Props {
  build: Build;
  eager?: boolean;
}

const BuildGallery = ({ build, eager = false }: Props) => {
  const media: BuildMedia[] =
    build.media && build.media.length > 0
      ? build.media
      : [{ url: build.image, type: 'photo' }];

  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  const current = media[active] || media[0];
  const photos = media.filter((m) => m.type === 'photo');

  const go = (dir: -1 | 1) => {
    setActive((i) => (i + dir + media.length) % media.length);
  };

  // Индекс текущего фото среди фото (для лайтбокса)
  const photoIndex = photos.findIndex((p) => p.url === current.url);

  return (
    <div className="relative overflow-hidden">
      <div className="relative aspect-[4/3] bg-background">
        {current.type === 'embed' ? (
          (() => {
            const embed = toEmbedUrl(current.url);
            return embed ? (
              <iframe
                src={embed}
                title={build.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-full bg-black border-0"
              />
            ) : (
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full flex flex-col items-center justify-center gap-2 bg-black text-primary"
              >
                <Icon name="ExternalLink" size={28} />
                <span className="text-sm font-display uppercase tracking-wide">Смотреть видео</span>
              </a>
            );
          })()
        ) : current.type === 'video' ? (
          <video
            src={current.url}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-cover bg-black"
          />
        ) : (
          <button
            type="button"
            onClick={() => setZoom(true)}
            className="block w-full h-full cursor-zoom-in group/ph"
            aria-label="Открыть фото на весь экран"
          >
            <SmartImage
              src={current.url}
              alt={build.name}
              eager={eager}
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover transition-transform duration-500 group-hover/ph:scale-105"
            />
            <span className="absolute bottom-3 left-3 w-9 h-9 flex items-center justify-center bg-background/70 backdrop-blur text-primary clip-corner opacity-0 group-hover/ph:opacity-100 transition-opacity">
              <Icon name="Expand" size={16} />
            </span>
          </button>
        )}

        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-background/80 backdrop-blur border border-border text-foreground hover:text-primary hover:border-primary/50 transition-colors clip-corner z-10"
              aria-label="Предыдущее"
            >
              <Icon name="ChevronLeft" size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-background/80 backdrop-blur border border-border text-foreground hover:text-primary hover:border-primary/50 transition-colors clip-corner z-10"
              aria-label="Следующее"
            >
              <Icon name="ChevronRight" size={18} />
            </button>
            <span className="absolute top-3 left-3 px-2 py-0.5 bg-background/80 backdrop-blur border border-border text-xs font-display tracking-wide clip-corner z-10">
              {active + 1}/{media.length}
            </span>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="flex gap-2 mt-2">
          {media.map((m, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative w-16 h-12 shrink-0 clip-corner border overflow-hidden transition-colors ${
                active === i ? 'border-primary' : 'border-border hover:border-primary/40'
              }`}
              aria-label={`Медиа ${i + 1}`}
            >
              {m.type === 'video' || m.type === 'embed' ? (
                <div className="w-full h-full flex items-center justify-center bg-background text-primary">
                  <Icon name="Play" size={18} />
                </div>
              ) : (
                <img src={m.url} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {zoom && photoIndex >= 0 && (
        <ImageLightbox
          src={photos[photoIndex].url}
          alt={build.name}
          counter={photos.length > 1 ? `${photoIndex + 1} / ${photos.length}` : undefined}
          onClose={() => setZoom(false)}
          onPrev={
            photos.length > 1
              ? () => {
                  const prev = (photoIndex - 1 + photos.length) % photos.length;
                  setActive(media.indexOf(photos[prev]));
                }
              : undefined
          }
          onNext={
            photos.length > 1
              ? () => {
                  const next = (photoIndex + 1) % photos.length;
                  setActive(media.indexOf(photos[next]));
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default BuildGallery;