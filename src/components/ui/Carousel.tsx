import { useCallback, useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";

interface CarouselProps {
  slides: ReactNode[];
  autoPlayMs?: number;
  ariaLabel: string;
  className?: string;
}

export function Carousel({ slides, autoPlayMs = 6000, ariaLabel, className = "rounded-2xl" }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % count) + count) % count);
    },
    [count]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Autoplay — pausa quando só há 1 slide ou quando o usuário está com o
  // ponteiro em cima (evita trocar de slide enquanto ele lê/interage).
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (count <= 1 || isPaused) return;
    const timer = window.setInterval(goNext, autoPlayMs);
    return () => window.clearInterval(timer);
  }, [count, isPaused, autoPlayMs, goNext]);

  function handleTouchStart(event: TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  }

  if (count === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label={ariaLabel}
      className={`group relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${count}`}
            aria-hidden={index !== activeIndex}
            className="w-full shrink-0"
          >
            {slide}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Slide anterior"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 focus-visible:opacity-100"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            aria-label="Próximo slide"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 focus-visible:opacity-100"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                aria-label={`Ir para o slide ${index + 1}`}
                aria-current={index === activeIndex}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}