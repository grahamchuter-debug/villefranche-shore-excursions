import type { BookingHeroSlide } from "@/lib/booking/booking-config";

type BookingHeroMediaProps = {
  slides: readonly BookingHeroSlide[];
  className?: string;
};

/**
 * Full-bleed opening gallery — AVIF/WebP with responsive srcset.
 * Static export: formats are pre-generated; no runtime image CDN.
 */
export function BookingHeroMedia({ slides, className = "" }: BookingHeroMediaProps) {
  return (
    <div className={`book-hero-stage ${className}`.trim()} aria-hidden="true">
      {slides.map((slide) => (
        <div key={slide.id} className="book-hero-layer">
          <picture>
            <source
              type="image/avif"
              srcSet={slide.avifSrcSet}
              sizes="100vw"
            />
            <source
              type="image/webp"
              srcSet={slide.webpSrcSet}
              sizes="100vw"
            />
            <img
              src={slide.fallbackSrc}
              alt=""
              width={slide.width}
              height={slide.height}
              decoding="async"
              fetchPriority={slide.priority ? "high" : "low"}
              loading={slide.priority ? "eager" : "lazy"}
            />
          </picture>
        </div>
      ))}
    </div>
  );
}
