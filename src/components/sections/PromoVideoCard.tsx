"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type PromoVideoCardProps = {
  videoSrc: string;
  posterSrc: string;
  title: string;
  playLabel: string;
  closeLabel: string;
  ariaLabel: string;
};

function lockPageScroll() {
  const scrollY = window.scrollY;
  const { style } = document.body;

  style.position = "fixed";
  style.top = `-${scrollY}px`;
  style.left = "0";
  style.right = "0";
  style.width = "100%";
  style.overflow = "hidden";

  return () => {
    style.position = "";
    style.top = "";
    style.left = "";
    style.right = "";
    style.width = "";
    style.overflow = "";
    window.scrollTo(0, scrollY);
  };
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 5.14v13.72L19 12 8 5.14z" />
    </svg>
  );
}

export function PromoVideoCard({
  videoSrc,
  posterSrc,
  title,
  playLabel,
  closeLabel,
  ariaLabel,
}: PromoVideoCardProps) {
  const titleId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const closeModal = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setIsOpen(false);
  }, []);
  const openModal = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const unlockScroll = lockPageScroll();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      unlockScroll();
    };
  }, [isOpen, closeModal]);

  useEffect(() => {
    if (!isOpen) return;

    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => undefined);
  }, [isOpen]);

  const modal =
    isOpen &&
    isMounted &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] overflow-hidden bg-black"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <p id={titleId} className="sr-only">
          {ariaLabel}
        </p>

        <button
          type="button"
          onClick={closeModal}
          className="absolute right-4 top-4 z-[210] flex h-10 w-10 items-center justify-center text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:right-6 sm:top-6"
          aria-label={closeLabel}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="flex h-full w-full items-center justify-center px-4">
          <video
            ref={videoRef}
            src={videoSrc}
            className="block w-auto max-w-[92vw] object-contain"
            style={{ maxHeight: "75vh", height: "auto" }}
            controls
            autoPlay
            playsInline
          />
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <article className="mx-auto w-full max-w-[700px]">
        <button
          type="button"
          onClick={openModal}
          className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.14)] transition-shadow duration-500 hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood/40 focus-visible:ring-offset-2"
          aria-label={playLabel}
        >
          <Image
            src={posterSrc}
            alt=""
            fill
            sizes="(max-width: 700px) 100vw, 700px"
            className="object-cover"
          />

          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-white pl-1 text-foreground shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-out group-hover:scale-[1.05] sm:h-[76px] sm:w-[76px]">
              <PlayIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            </span>
          </span>
        </button>

        <p className="mt-6 text-center font-display text-xl tracking-tight text-foreground sm:text-2xl">
          {title}
        </p>
      </article>

      {modal}
    </>
  );
}
