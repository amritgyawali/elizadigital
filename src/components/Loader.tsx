import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@react-three/drei';
import { useStore } from '../store/useStore';

export default function Loader() {
  const { progress } = useProgress();
  const loaderDone   = useStore((s) => s.loaderDone);
  const setLoaderDone = useStore((s) => s.setLoaderDone);

  useEffect(() => {
    // Auto-complete loader after 1.8s if no external assets are loading
    const autoCompleteTimer = setTimeout(() => {
      setLoaderDone(true);
    }, 1800);

    // If assets start loading, clear auto-timer and track their progress
    if (progress >= 99 && progress > 0) {
      clearTimeout(autoCompleteTimer);
      const t = setTimeout(() => setLoaderDone(true), 600);
      return () => clearTimeout(t);
    }

    return () => clearTimeout(autoCompleteTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, setLoaderDone]);

  return (
    <AnimatePresence>
      {!loaderDone && (
        <motion.div key="loader"
          initial={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          aria-label="Loading" aria-busy="true"
          style={{ position:'fixed', inset:0, zIndex:9999, background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2.5rem' }}>
          <div style={{ width:56, height:56, background:'var(--brand)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.8rem', color:'white' }}>
            E
          </div>
          <div style={{ width:220, display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            <div style={{ height:2, background:'rgba(244,244,246,0.08)', borderRadius:2, overflow:'hidden' }}>
              <motion.div className="loader-bar"
                initial={{ scaleX:0 }} animate={{ scaleX: progress/100 }}
                transition={{ ease:'easeOut', duration:0.3 }}
                style={{ height:'100%', transformOrigin:'left' }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span className="label" style={{ fontSize:'0.7rem' }}>Eliza Digital Solutions</span>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'0.85rem', color:'var(--text-muted)', fontWeight:600 }}>{Math.round(progress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
