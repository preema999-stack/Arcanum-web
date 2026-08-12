'use client';

interface LenisLike {
  scrollTo: (target: HTMLElement | number | string, opts?: { offset?: number; duration?: number }) => void;
  start: () => void;
  stop: () => void;
  resize: () => void;
}

declare global {
  interface Window {
    __lenis?: LenisLike;
  }
}

/**
 * Smoothly scroll the page to a section by element id.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = window.__lenis;
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(el, { offset: -80, duration: 1.2 });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const target = Math.max(0, Math.min(maxScroll, y));
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
}
