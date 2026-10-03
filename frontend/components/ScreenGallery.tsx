"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type GalleryShot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  note?: string;
};

type LenisLike = { stop: () => void; start: () => void };

/**
 * Swipeable screen strip + full-screen viewer.
 * - "device": phone screens in a horizontal scroll-snap row (one-handed swipe).
 * - "wide":   a single wide image (spreads, desktop UI) shown full width.
 * Tapping any image opens the viewer: swipe or arrow keys between images,
 * tap to zoom (for dense spreads), Escape / close button to exit.
 */
export default function ScreenGallery({
  shots,
  layout = "device",
  priority = false,
}: {
  shots: GalleryShot[];
  layout?: "device" | "wide";
  priority?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [open, setOpen] = useState(false);

  const openAt = (i: number) => {
    setIndex(i);
    setZoomed(false);
    setOpen(true);
  };

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
    if (open) {
      if (!dlg.open) dlg.showModal();
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();
      // Jump (no animation) to the tapped image.
      requestAnimationFrame(() => {
        const track = trackRef.current;
        if (track) track.scrollTo({ left: track.clientWidth * index, behavior: "instant" as ScrollBehavior });
      });
    } else if (dlg.open) {
      dlg.close();
    }
    return () => {
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
    // index intentionally excluded: only position on open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const go = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      const next = Math.min(shots.length - 1, Math.max(0, index + dir));
      setZoomed(false);
      track.scrollTo({ left: track.clientWidth * next, behavior: "smooth" });
    },
    [index, shots.length]
  );

  // Keep the counter in sync with swipes.
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== index) {
      setIndex(i);
      setZoomed(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  const current = shots[index];

  return (
    <>
      {layout === "wide" ? (
        <div className="space-y-10">
          {shots.map((s, i) => (
            <figure key={s.src}>
              <button
                type="button"
                onClick={() => openAt(i)}
                className="focus-ring block w-full overflow-hidden rounded-[20px] border border-line bg-panel sm:rounded-[24px]"
                aria-label={`View full screen: ${s.title ?? s.alt}`}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={s.width}
                  height={s.height}
                  priority={priority && i === 0}
                  sizes="(min-width: 1380px) 1100px, (min-width: 1024px) 75vw, 100vw"
                  className="h-auto w-full"
                />
              </button>
              {(s.title || s.note) && (
                <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-inkmuted">
                  <span>{s.title}</span>
                  <span aria-hidden="true">Tap to zoom ↗</span>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      ) : (
        <div className="-mx-5 sm:-mx-6 lg:mx-0">
          <ul
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 sm:scroll-px-6 sm:px-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 xl:grid-cols-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Screens — swipe to see more"
          >
            {shots.map((s, i) => (
              <li key={s.src} className="w-[68%] max-w-[300px] shrink-0 snap-start sm:w-[42%] lg:w-auto lg:max-w-none">
                <button
                  type="button"
                  onClick={() => openAt(i)}
                  className="focus-ring block w-full overflow-hidden rounded-[24px] border border-line bg-panel"
                  aria-label={`View full screen: ${s.title ?? s.alt}`}
                >
                  <Image
                    src={s.src}
                    alt={s.alt}
                    width={s.width}
                    height={s.height}
                    sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 28vw, (min-width: 640px) 42vw, 68vw"
                    className="h-auto w-full"
                  />
                </button>
                {s.title && (
                  <p className="mt-3 font-display text-base font-semibold leading-snug text-ink">{s.title}</p>
                )}
                {s.note && <p className="mt-1 text-sm leading-relaxed text-inkmuted">{s.note}</p>}
              </li>
            ))}
          </ul>
          {shots.length > 1 && (
            <p className="px-5 font-mono text-[10px] uppercase tracking-wider text-inkmuted sm:px-6 lg:hidden" aria-hidden="true">
              Swipe → · {shots.length} screens
            </p>
          )}
        </div>
      )}

      {/* Full-screen viewer — fixed dark backdrop in both themes, like a photo viewer. */}
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onKeyDown={onKeyDown}
        aria-label="Image viewer"
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-black p-0 text-white backdrop:bg-black"
      >
        {open && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3 px-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
              <span className="pl-2 font-mono text-xs text-white/70" aria-live="polite">
                {index + 1} / {shots.length}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                aria-label="Close viewer"
                autoFocus
              >
                ×
              </button>
            </div>

            <div
              ref={trackRef}
              onScroll={onScroll}
              className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {shots.map((s, i) => (
                <div
                  key={s.src}
                  className={`flex h-full w-full shrink-0 snap-center ${
                    zoomed && i === index ? "overflow-auto" : "items-center justify-center overflow-hidden"
                  } p-3`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.src}
                    alt={s.alt}
                    width={s.width}
                    height={s.height}
                    loading={Math.abs(i - index) <= 1 ? "eager" : "lazy"}
                    onClick={() => setZoomed((z) => !z)}
                    className={
                      zoomed && i === index
                        ? "h-auto w-auto max-w-none cursor-zoom-out"
                        : "max-h-full max-w-full cursor-zoom-in object-contain"
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={index === 0}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 disabled:opacity-30"
                aria-label="Previous image"
              >
                ←
              </button>
              <p className="min-w-0 flex-1 text-center text-sm leading-snug text-white/85">
                {current?.title}
                <span className="block text-xs text-white/50">Tap image to {zoomed ? "fit" : "zoom"}</span>
              </p>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={index === shots.length - 1}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 disabled:opacity-30"
                aria-label="Next image"
              >
                →
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
