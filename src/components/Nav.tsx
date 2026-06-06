import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Process',  href: '#process'  },
  { label: 'Work',     href: '#proof'    },
  { label: 'Contact',  href: '#contact'  },
];

export default function Nav() {
  const menuOpen       = useStore((s) => s.menuOpen);
  const setMenuOpen    = useStore((s) => s.setMenuOpen);
  const scrollProgress = useStore((s) => s.scrollProgress);
  const firstFocusRef  = useRef<HTMLAnchorElement>(null);
  const scrolled       = scrollProgress > 0.02;

  useEffect(() => {
    if (menuOpen) firstFocusRef.current?.focus();
  }, [menuOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && menuOpen) setMenuOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [menuOpen, setMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header
      role="banner"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'background 0.35s, backdrop-filter 0.35s, box-shadow 0.35s',
        background: scrolled ? 'rgba(248, 247, 244, 0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        boxShadow: scrolled ? 'var(--shadow-xs)' : 'none',
      }}
    >
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'1.1rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Logo */}
        <a href="#" aria-label="Eliza Digital Solutions home" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <span style={{ width:32, height:32, background:'var(--brand)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.1rem', color:'white' }}>E</span>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:'1rem', color:'var(--text)', letterSpacing:'-0.02em' }}>Eliza Digital</span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation" style={{ display:'flex', alignItems:'center', gap:'2.5rem' }} className="desktop-nav">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} style={{ color:'var(--text-muted)', textDecoration:'none', fontSize:'0.9rem', fontWeight:500, transition:'color 0.2s' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--text)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}>
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn-primary" style={{ padding:'0.55rem 1.3rem', fontSize:'0.875rem' }}>Let&apos;s Talk</a>
        </nav>

        {/* Hamburger */}
        <button aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
          style={{ background:'none', border:'none', color:'var(--text)', cursor:'pointer', padding:'0.5rem', display:'none' }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu"
            initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }}
            transition={{ duration:0.25, ease:'easeOut' }}
            style={{ position:'fixed', inset:0, background:'rgba(248,247,244,0.97)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', zIndex:99, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'2rem', padding:'2rem' }}>
            <button aria-label="Close menu" onClick={() => setMenuOpen(false)}
              style={{ position:'absolute', top:'1.5rem', right:'2rem', background:'none', border:'none', color:'var(--text)', cursor:'pointer', padding:'0.5rem' }}>
              <X size={24} />
            </button>
            {[...NAV_LINKS, { label:"Let's Talk", href:'#contact' }].map((link, i) => (
              <motion.a key={link.href} href={link.href}
                ref={i === 0 ? firstFocusRef : undefined}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06, duration:0.3 }}
                style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.5rem,5vw,2.5rem)', fontWeight:700, color:i===NAV_LINKS.length?'var(--brand)':'var(--text)', textDecoration:'none', letterSpacing:'-0.02em' }}>
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
