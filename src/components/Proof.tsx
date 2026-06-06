import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { TESTIMONIALS, STATS } from '../data/services';
import { useStore } from '../store/useStore';

/** Animated counter from 0 to target value */
function AnimatedCounter({
  value,
  suffix,
  decimals = 0,
  inView,
  reducedMotion,
}: {
  value: number;
  suffix: string;
  decimals?: number;
  inView: boolean;
  reducedMotion: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (!inView || reducedMotion) {
      setCurrent(value);
      return;
    }
    startTime.current = performance.now();
    const duration = 1800;

    const frame = (now: number) => {
      const elapsed = now - startTime.current;
      const t = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(eased * value);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [inView, value, reducedMotion]);

  return (
    <span>
      {decimals > 0 ? current.toFixed(decimals) : Math.round(current)}
      {suffix}
    </span>
  );
}

export default function Proof() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reducedMotion = useStore((s) => s.reducedMotion);

  return (
    <section
      ref={ref}
      id="proof"
      aria-label="Results and testimonials"
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
          Proof
        </motion.span>
        <motion.h2
          className="display-md"
          initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ color: 'var(--text)', maxWidth: 460 }}
        >
          Numbers that actually mean something.
        </motion.h2>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '5rem',
        }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.2 + i * 0.1 }}
            className="stat-card"
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 700,
                color: 'var(--text)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals}
                inView={inView}
                reducedMotion={reducedMotion}
              />
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Testimonials */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <motion.blockquote
            key={t.author}
            initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: reducedMotion ? 0 : 0.5 + i * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="card-elevated"
            style={{ margin: 0 }}
          >
            {/* Quote mark */}
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                color: 'var(--brand)',
                lineHeight: 0.8,
                display: 'block',
                marginBottom: '1rem',
              }}
              aria-hidden="true"
            >
              "
            </span>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text)',
                lineHeight: 1.65,
                marginBottom: '1.5rem',
                fontStyle: 'italic',
              }}
            >
              {t.quote}
            </p>
            <footer>
              <p style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text)' }}>
                {t.author}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {t.role}
              </p>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}
