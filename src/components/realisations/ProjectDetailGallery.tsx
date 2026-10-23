"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { RealisationImage as RealisationImageType } from "@/lib/realisations";
import { RealisationImage, portraitImageSizes } from "./RealisationImage";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

type ProjectDetailGalleryProps = {
  images: RealisationImageType[];
  projectTitle: string;
  cover: string;
  variant?: "grid" | "cover";
};

const controlClass = "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-3xl text-white transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export function ProjectDetailGallery({ images, projectTitle, cover, variant = "grid" }: ProjectDetailGalleryProps) {
  const t = useTranslations("realisations.lightbox");
  const tCommon = useTranslations("common");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const photos = Array.from(new Set([cover, ...images.map((image) => image.src)].filter(Boolean)));
  const activePhoto = activeIndex === null ? null : photos[activeIndex];
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  function openPhoto(src: string) {
    setActiveIndex(photos.indexOf(src));
    dialogRef.current?.showModal();
  }

  function movePhoto(direction: number) {
    setActiveIndex((current) => current === null ? null : (current + direction + photos.length) % photos.length);
  }

  function close() { dialogRef.current?.close(); }

  if (photos.length === 0 || (variant === "cover" && !cover)) {
    return variant === "cover"
      ? <ImagePlaceholder aspectRatio="wide" label={tCommon("photoComingSoon")} />
      : null;
  }

  return (
    <>
      {variant === "cover" ? (
        <button type="button" onClick={() => openPhoto(cover)} aria-label={t("open", { number: 1 })} aria-haspopup="dialog"
          className="relative block aspect-[21/9] w-full cursor-zoom-in overflow-hidden bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
          <RealisationImage src={cover} alt={projectTitle} priority sizes="100vw" />
          <span className="absolute right-4 bottom-4 bg-black/65 px-4 py-2 text-sm text-white" aria-hidden="true">{t("enlarge")}</span>
        </button>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <button type="button" key={image.src} onClick={() => openPhoto(image.src)} aria-label={t("open", { number: index + 1 })} aria-haspopup="dialog"
              className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
              <RealisationImage src={image.src} alt={image.alt || projectTitle} priority={index < 2}
                sizes={portraitImageSizes}
                className="transition-transform duration-300 motion-safe:group-hover:scale-[1.02]" />
              <span className="absolute right-3 bottom-3 bg-black/65 px-3 py-2 text-sm text-white" aria-hidden="true">{t("enlarge")}</span>
            </button>
          ))}
        </div>
      )}
      <dialog ref={dialogRef} aria-label={t("title", { project: projectTitle })}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-black/95 p-0 text-white backdrop:bg-black/80"
        onClose={() => setActiveIndex(null)}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            movePhoto(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}>
        {activePhoto && activeIndex !== null ? (
          <div className="flex h-full flex-col px-3 py-4 sm:px-6">
            <div className="flex shrink-0 items-center gap-4 pb-4">
              <p className="min-w-0 flex-1 truncate text-sm sm:text-base">{projectTitle}</p>
              <p role="status" className="shrink-0 text-sm tabular-nums">{t("counter", { current: activeIndex + 1, total: photos.length })}</p>
              <button type="button" onClick={close} className={controlClass} aria-label={t("close")}><span aria-hidden="true">×</span></button>
            </div>
            <div className="relative min-h-0 flex-1"
              onTouchStart={(event) => {
                const touch = event.touches[0];
                touchStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
              }}
              onTouchEnd={(event) => {
                const start = touchStart.current;
                touchStart.current = null;
                if (!start || !event.changedTouches[0]) return;
                const dx = event.changedTouches[0].clientX - start.x;
                const dy = event.changedTouches[0].clientY - start.y;
                if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) movePhoto(dx < 0 ? 1 : -1);
              }}
              onTouchCancel={() => { touchStart.current = null; }}>
              <RealisationImage key={activePhoto} src={activePhoto} objectFit="contain" sizes="100vw"
                alt={`${projectTitle} — ${t("counter", { current: activeIndex + 1, total: photos.length })}`} />
            </div>
            {photos.length > 1 ? (
              <div className="flex shrink-0 justify-center gap-6 pt-4">
                <button type="button" onClick={() => movePhoto(-1)} className={controlClass} aria-label={t("previous")}><span aria-hidden="true">‹</span></button>
                <button type="button" onClick={() => movePhoto(1)} className={controlClass} aria-label={t("next")}><span aria-hidden="true">›</span></button>
              </div>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
