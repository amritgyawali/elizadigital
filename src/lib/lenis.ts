import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/**
 * Initialize Lenis smooth scroll, wire it to GSAP ScrollTrigger,
 * and drive the RAF from GSAP's ticker so they stay perfectly in sync.
 *
 * Call once at app boot (after DOM ready).
 */
export function initLenis(reducedMotion: boolean): Lenis {
  if (lenisInstance) {
    lenisInstance.destroy();
  }

  const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 769;

  lenisInstance = new Lenis({
    // Smooth lerp — 0.1 feels natural and premium
    lerp: reducedMotion ? 1 : 0.1,
    duration: reducedMotion ? 0 : 1.1,
    smoothWheel: !reducedMotion,
    // On mobile use native touch momentum, on desktop smooth scroll
    syncTouch: isMobile,
    touchMultiplier: isMobile ? 1.5 : 1,
  });

  // Wire ScrollTrigger to Lenis so pinned sections work correctly
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Drive Lenis from GSAP's ticker — single RAF loop, no jank
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });

  // Disable GSAP's built-in lag smoothing so Lenis timing is authoritative
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis(): void {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}
