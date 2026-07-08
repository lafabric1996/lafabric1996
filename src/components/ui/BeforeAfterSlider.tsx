"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  ariaLabel: string;
  className?: string;
  priority?: boolean;
  autoDemo?: boolean;
};

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  ariaLabel,
  className,
  priority = false,
  autoDemo = false,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const hasInteracted = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = (clientX - rect.left) / rect.width;
    setPosition(Math.min(100, Math.max(0, ratio * 100)));
  }, []);

  useEffect(() => {
    if (!autoDemo) return undefined;

    const total = 1100;
    const from = 50;
    const to = 30;
    let raf = 0;
    const start = performance.now();

    function frame(now: number) {
      if (hasInteracted.current) return;
      const elapsed = now - start;
      let value: number;

      if (elapsed <= total / 2) {
        value = from + (to - from) * easeInOutCubic(elapsed / (total / 2));
      } else if (elapsed <= total) {
        value = to + (from - to) * easeInOutCubic((elapsed - total / 2) / (total / 2));
      } else {
        setPosition(from);
        return;
      }

      setPosition(value);
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [autoDemo]);

  useEffect(() => {
    if (!isDragging) return undefined;

    const handleMove = (event: PointerEvent) => updateFromClientX(event.clientX);
    const handleUp = () => setIsDragging(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [isDragging, updateFromClientX]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    hasInteracted.current = true;
    setIsDragging(true);
    updateFromClientX(event.clientX);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    hasInteracted.current = true;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((prev) => Math.max(0, prev - 5));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((prev) => Math.min(100, prev + 5));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[4/3] w-full touch-none overflow-hidden select-none",
        className,
      )}
      onPointerDown={handlePointerDown}
    >
      <Image
        src={afterSrc}
        alt={afterLabel}
        fill
        sizes="(max-width: 768px) 100vw, 80vw"
        className="object-cover"
        priority={priority}
      />

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeLabel}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
          priority={priority}
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 bg-background/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground sm:left-4 sm:top-4 sm:text-xs">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 bg-background/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground sm:right-4 sm:top-4 sm:text-xs">
        {afterLabel}
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
        style={{ left: `${position}%` }}
      >
        <div
          role="slider"
          tabIndex={0}
          aria-label={ariaLabel}
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={handleKeyDown}
          className="pointer-events-auto absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-foreground shadow-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood active:scale-95"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8 7 3 12l5 5" />
            <path d="M16 7l5 5-5 5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
