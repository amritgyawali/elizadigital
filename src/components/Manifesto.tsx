import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useStore } from '../store/useStore';

const MANIFESTO_LINES = [
  'Most agencies give you a deliverable.',
  'We give you an unfair advantage.',
  'Every channel. One obsession: results.',
];

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reducedMotion = useStore((s) => s.reducedMotion);

  return (
    <section
      ref={ref}
      id="manifesto"
      aria-label="About Eliza Digital Solutions"
      style={{
        padding: '10rem 2rem',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: 800,
        }}
      >
        <motion.span
          className="label"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ display: 'block', marginBottom: '2rem' }}
        >
          Our philosophy
        </motion.span>

        {MANIFESTO_LINES.map((line, i) => (
          <motion.p
            key={i}
            className="display-md"
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: reducedMotion ? 0 : 0.15 + i * 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              color: i === 1 ? 'var(--text)' : 'var(--text-muted)',
              marginBottom: '0.6rem',
              lineHeight: 1.15,
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
