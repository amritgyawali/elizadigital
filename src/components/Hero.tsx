import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useStore } from '../store/useStore';

const HEADLINE = 'We build brands the internet remembers.';
const SUB = 'Marketing, content, video, web, software & branding — under one roof.';

export default function Hero() {
  const reducedMotion = useStore((s) => s.reducedMotion);
  const words = HEADLINE.split(' ');

  return (
    <section
      id="hero"
      aria-label="Hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '8rem 2rem 4rem',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Aurora background glow */}
      <div className="hero-aurora" />
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16,1,0.3,1] }}
        style={{ marginBottom: '2rem', display:'flex', alignItems:'center', gap:'0.6rem' }}
      >
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'var(--brand-light)', border: '1px solid var(--brand-mid)',
          borderRadius: 999, padding: '0.3rem 0.9rem',
        }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--brand)', flexShrink:0 }} />
          <span className="label" style={{ color:'var(--brand)', letterSpacing:'0.12em' }}>Eliza Digital Solutions</span>
        </span>
      </motion.div>

      {/* Headline — word-by-word reveal */}
      <h1 className="display-xl" style={{ maxWidth: 900, marginBottom: '2.5rem', color: 'var(--text)' }}>
        {words.map((word, i) => (
          <span key={i} className="word-wrap" style={{ marginRight: '0.28em' }}>
            <motion.span
              className="word-inner"
              initial={reducedMotion ? {} : { y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.7, delay: reducedMotion ? 0 : 0.4 + i * 0.07, ease: [0.16,1,0.3,1] }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h1>

      {/* Sub */}
      <motion.p
        className="body-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: reducedMotion ? 0 : 1.0, ease: [0.16,1,0.3,1] }}
        style={{ color: 'var(--text-muted)', maxWidth: 520, marginBottom: '3.5rem' }}
      >
        {SUB}
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: reducedMotion ? 0 : 1.15, ease: [0.16,1,0.3,1] }}
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
      >
        <a href="#contact" className="btn-primary">Start a project</a>
        <a href="#services" className="btn-secondary">View services</a>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reducedMotion ? 0 : 2, duration: 1 }}
        style={{ marginTop: 'auto', paddingTop: '4rem', display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--text-muted)' }}
        aria-hidden="true"
      >
        <motion.div animate={reducedMotion ? {} : { y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease:'easeInOut' }}>
          <ArrowDown size={14} />
        </motion.div>
        <span style={{ fontSize:'0.75rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>Scroll</span>
      </motion.div>
    </section>
  );
}
