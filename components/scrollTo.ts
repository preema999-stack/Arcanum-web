'use client';

interface LenisLike {
  scrollTo: (target: number, opts?: { duration?: number }) => void;
}

declare global {
  interface Window {
    __lenis?: LenisLike;
  }
}

function smoothScrollTo(y: number) {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const target = Math.max(0, Math.min(maxScroll, y));

  const lenis = window.__lenis;
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(target, { duration: 1.4 });
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
}

/**
 * Smoothly scroll the page to a section by element id.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 80);
}
