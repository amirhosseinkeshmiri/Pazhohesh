"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function ResearchPitchVideo() {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);

  const closeVideo = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setIsOpen(false);
    requestAnimationFrame(() => playButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const video = videoRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeVideo();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      video?.pause();
    };
  }, [closeVideo, isOpen]);

  return (
    <>
      <section className="hero-tech relative mt-9 flex aspect-video min-h-52 overflow-hidden rounded-2xl px-5 pb-7 text-center text-white sm:min-h-72 sm:pb-9" aria-label="معرفی برنامه Research Pitch">
        <div className="relative z-10 mt-auto w-full">
          <button
            ref={playButtonRef}
            type="button"
            aria-label="پخش ویدیو"
            onClick={() => setIsOpen(true)}
            className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-white/50 bg-white/20 text-white shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-1 h-7 w-7 fill-current">
              <path d="m8 5 11 7-11 7V5Z" />
            </svg>
          </button>
          <p className="text-2xl font-black tracking-[0.12em] sm:text-3xl">RESEARCH PITCH</p>
          <p className="mt-1 text-sm text-blue-100 sm:text-base">حمایت از پژوهش‌های کاربردی</p>
        </div>
      </section>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="ویدیوی معرفی برنامه Research Pitch"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeVideo();
          }}
        >
          <div
            className="relative aspect-[9/16] max-h-[88dvh] max-w-[92vw] overflow-hidden rounded-xl bg-black shadow-2xl"
            style={{ width: "min(92vw, calc(88dvh * 9 / 16), 28.75rem)" }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="بستن ویدیو"
              onClick={closeVideo}
              className="absolute left-2 top-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/70 text-white shadow-md transition hover:bg-black/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <video ref={videoRef} className="h-full w-full bg-black object-contain" controls playsInline autoPlay preload="metadata">
              <source src="/videos/research-pitch.mp4" type="video/mp4" />
              مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
          </div>
        </div>
      )}
    </>
  );
}
