import { Globe, Link, ExternalLink } from 'lucide-react';
import { SERVICES } from '../data/services';

// Using Globe/Link/ExternalLink as social stand-ins since lucide-react
// doesn't bundle Twitter/LinkedIn/Instagram in this version.
const SOCIAL_LINKS = [
  { Icon: Globe, href: 'https://twitter.com/elizadigital', label: 'Twitter / X' },
  { Icon: Link, href: 'https://linkedin.com/company/elizadigital', label: 'LinkedIn' },
  { Icon: ExternalLink, href: 'https://instagram.com/elizadigital', label: 'Instagram' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: '1px solid var(--border)',
        padding: '4rem 2rem 3rem',
        background: 'var(--bg-tinted)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '4rem',
          alignItems: 'start',
        }}
      >
        {/* Brand */}
        <div>
          <a
            href="#"
            aria-label="Eliza Digital Solutions home"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                background: 'var(--brand)',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'white',
              }}
            >
              E
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'var(--text)',
                letterSpacing: '-0.02em',
              }}
            >
              Eliza Digital
            </span>
          </a>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              maxWidth: 220,
              lineHeight: 1.6,
            }}
          >
            A modern full-stack creative + tech agency. Premium, confident, future-facing.
          </p>
        </div>

        {/* Service links */}
        <nav aria-label="Footer service links">
          <p className="label" style={{ marginBottom: '1.25rem', fontSize: '0.7rem' }}>
            Services
          </p>
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}
          >
            {SERVICES.map((s) => (
              <li key={s.id}>
                <a
                  href={`#service-${s.id}`}
                  style={{
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = 'var(--text)')
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = 'var(--text-muted)')
                  }
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Socials + copyright */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {SOCIAL_LINKS.map(({ Icon, href, label }) => (
              <a
                key={href}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--text-muted)',
                  transition: 'color 0.2s',
                  display: 'flex',
                  padding: '0.5rem',
                  minWidth: 44,
                  minHeight: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(244,244,246,0.08)',
                  borderRadius: 6,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--text)';
                  (e.currentTarget as HTMLElement).style.borderColor =
                    'rgba(124,92,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                  (e.currentTarget as HTMLElement).style.borderColor =
                    'rgba(244,244,246,0.08)';
                }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              alignItems: 'flex-end',
            }}
          >
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              hello@elizadigital.com
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              &copy; {year} Eliza Digital Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          footer > div > div:last-child {
            align-items: flex-start !important;
          }
        }
      `}</style>
    </footer>
  );
}
