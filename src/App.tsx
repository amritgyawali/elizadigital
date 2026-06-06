import { useEffect, useState, Suspense, lazy } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { useStore } from './store/useStore';
import { initLenis } from './lib/lenis';
import { detectQualityTier, detectWebGL } from './lib/quality';
import { SERVICES } from './data/services';
import './styles/globals.css';

import Nav from './components/Nav';
import Loader from './components/Loader';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import ServiceSection from './components/ServiceSection';
import Process from './components/Process';
import Proof from './components/Proof';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/ui/CustomCursor';

// Lazy-load the heavy 3D scene
const Scene = lazy(() => import('./three/Scene'));

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const setQuality        = useStore((s) => s.setQuality);
  const setReducedMotion  = useStore((s) => s.setReducedMotion);
  const setWebGLAvailable = useStore((s) => s.setWebGLAvailable);
  const setScrollProgress = useStore((s) => s.setScrollProgress);
  const reducedMotion     = useStore((s) => s.reducedMotion);
  const webGLAvailable    = useStore((s) => s.webGLAvailable);
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 769);

  useEffect(() => {
    const quality  = detectQualityTier();
    const webgl    = detectWebGL();
    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setQuality(quality);
    setWebGLAvailable(webgl);
    setReducedMotion(reduced);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);

    initLenis(reduced);

    // Wire page-level scroll progress to zustand
    const poll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0) {
        ScrollTrigger.create({
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => setScrollProgress(self.progress),
        });
      } else {
        requestAnimationFrame(poll);
      }
    };
    poll();

    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="grain-overlay" aria-hidden="true" />
      {!reducedMotion && <CustomCursor />}
      <Loader />

      {webGLAvailable && !isMobile && (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      )}

      <Nav />

      <div id="dom-root">
        <main id="main">
          <Hero />
          <div className="section-divider" />
          <Manifesto />
          <div id="services">
            {SERVICES.map((service, i) => (
              <ServiceSection
                key={service.id}
                service={service}
                isLast={i === SERVICES.length - 1}
              />
            ))}
          </div>
          <div className="section-divider" />
          <Process />
          <div className="section-divider" />
          <Proof />
          <div className="section-divider" />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
