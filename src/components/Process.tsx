import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PROCESS_STEPS } from '../data/services';
import { useStore } from '../store/useStore';

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reducedMotion = useStore((s) => s.reducedMotion);

  return (
    <section
      ref={ref}
      id="process"
      aria-label="Our process"
      style={{
        padding: '10rem 2rem',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '5rem' }}>
        <motion.span
          className="label"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ display: 'block', marginBottom: '1rem' }}
        >
          How we work
        </motion.span>
        <motion.h2
          className="display-md"
          initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ color: 'var(--text)', maxWidth: 480 }}
        >
          A process built for results, not applause.
        </motion.h2>
      </div>

      {/* Steps grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
        }}
      >
        {PROCESS_STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: reducedMotion ? 0 : 0.2 + i * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              background: 'var(--bg-elev)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '2rem',
              boxShadow: 'var(--shadow-xs)',
              transition: 'box-shadow 0.25s, transform 0.25s',
            }}
          >
            {/* Number */}
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--brand)',
                letterSpacing: '0.1em',
                display: 'block',
                marginBottom: '1.25rem',
              }}
            >
              {step.number}
            </span>

            {/* Connecting line */}
            <div
              style={{
                height: 1,
                background: 'var(--border)',
                marginBottom: '1.5rem',
              }}
            />

            {/* Title */}
            <h3
              className="display-sm"
              style={{ color: 'var(--text)', marginBottom: '0.75rem' }}
            >
              {step.title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                lineHeight: 1.65,
              }}
            >
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
