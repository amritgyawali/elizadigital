import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import type { Service } from '../data/services';
import { useStore } from '../store/useStore';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  service: Service;
  isLast: boolean;
}

export default function ServiceSection({ service, isLast }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const setActiveSection  = useStore((s) => s.setActiveSection);
  const setSectionProgress = useStore((s) => s.setSectionProgress);
  const reducedMotion      = useStore((s) => s.reducedMotion);
  const inView = useInView(contentRef, { once: true, margin: '-20% 0px' });
  const isRight = service.index % 2 !== 0;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        if (self.isActive) {
          setActiveSection(service.id);
          setSectionProgress(self.progress);
        }
      },
      onEnter: () => setActiveSection(service.id),
      onLeave: () => { if (isLast) setActiveSection('process'); },
      onEnterBack: () => setActiveSection(service.id),
    });
    return () => trigger.kill();
  }, [service.id, isLast, setActiveSection, setSectionProgress]);

  const accentVar = `var(--${service.id})`;

  return (
    <section
      ref={containerRef}
      id={`service-${service.id}`}
      aria-label={service.title}
      style={{ height: '220vh', position: 'relative' }}
    >
      {/* Full-width sticky background: opaque on text side, transparent on 3D side */}
      <div
        className="service-sticky"
        style={{
          background: isRight
            ? 'linear-gradient(to right, transparent 46%, var(--bg) 52%)'
            : 'linear-gradient(to right, var(--bg) 48%, transparent 54%)',
        }}
      >
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', padding:'0 2rem', maxWidth:1280, margin:'0 auto', width:'100%' }}>
        {/* Copy column */}
        <div ref={contentRef} style={{ display:'flex', flexDirection:'column', justifyContent:'center', order: isRight ? 2 : 1 }}>
          {/* Index + accent */}
          <motion.div
            initial={reducedMotion ? {} : { opacity:0, x: isRight ? 20 : -20 }}
            animate={inView ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
            style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'0.75rem', fontWeight:700, color:accentVar, letterSpacing:'0.12em' }}>{String(service.index+1).padStart(2,'0')}</span>
            <div style={{ height:1, width:40, background:accentVar, opacity:0.6 }} />
            <span className="label" style={{ fontSize:'0.7rem' }}>{service.title}</span>
          </motion.div>

          <motion.h2 className="display-lg"
            initial={reducedMotion ? {} : { opacity:0, y:24 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.7, delay:0.1, ease:[0.16,1,0.3,1] }}
            style={{ marginBottom:'1.25rem', color:'var(--text)' }}>
            {service.title}
          </motion.h2>

          <motion.p
            initial={reducedMotion ? {} : { opacity:0, y:16 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.65, delay:0.18, ease:[0.16,1,0.3,1] }}
            style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1rem,2vw,1.3rem)', color:accentVar, fontWeight:600, marginBottom:'1.25rem', lineHeight:1.3 }}>
            {service.tagline}
          </motion.p>

          <motion.p className="body-lg"
            initial={reducedMotion ? {} : { opacity:0, y:16 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.65, delay:0.24, ease:[0.16,1,0.3,1] }}
            style={{ color:'var(--text-muted)', marginBottom:'2rem' }}>
            {service.description}
          </motion.p>

          <motion.ul
            initial={reducedMotion ? {} : { opacity:0, y:16 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.65, delay:0.3, ease:[0.16,1,0.3,1] }}
            style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.6rem', marginBottom:'2.5rem' }}>
            {service.bullets.map((b) => (
              <li key={b} style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.9rem', color:'var(--text-muted)' }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:accentVar, flexShrink:0 }} />
                {b}
              </li>
            ))}
          </motion.ul>

          <motion.a href="#contact"
            initial={reducedMotion ? {} : { opacity:0, y:12 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.6, delay:0.38, ease:[0.16,1,0.3,1] }}
            style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', color:accentVar, textDecoration:'none', fontSize:'0.875rem', fontWeight:500, width:'max-content', borderBottom:`1px solid ${accentVar}`, paddingBottom:'2px', transition:'opacity 0.2s' }}>
            Start this service <ArrowRight size={14} />
          </motion.a>
        </div>

        {/* 3D canvas reserve */}
        <div aria-hidden="true" style={{ order: isRight ? 1 : 2, minHeight: '50vh' }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #service-${service.id} { height: auto !important; }
          #service-${service.id} .service-sticky > div { grid-template-columns: 1fr !important; padding: 0 !important; gap: 0 !important; }
          #service-${service.id} .service-sticky > div > div:last-child { display: none !important; }
          #service-${service.id} .service-sticky > div > div:first-child { order: 1 !important; }
        }
      `}</style>
    </section>
  );
}
