import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { useStore } from '../store/useStore';

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reducedMotion = useStore((s) => s.reducedMotion);

  const [formState, setFormState] = useState<FormState>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'A valid email is required.';
    }
    if (!message.trim() || message.length < 10) {
      e.message = 'Message must be at least 10 characters.';
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setFormState('sending');

    // Front-end only — mailto fallback
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setFormState('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setFormState('error');
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    background: 'var(--bg-elev)',
    border: `1px solid ${hasError ? 'var(--video)' : 'var(--border-strong)'}`,
    borderRadius: 8,
    padding: '0.875rem 1rem',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: 'var(--shadow-xs)',
  });

  return (
    <section
      ref={ref}
      id="contact"
      aria-label="Contact Eliza Digital Solutions"
      style={{
        padding: '10rem 2rem',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6rem',
          alignItems: 'start',
        }}
      >
        {/* Left — CTA copy */}
        <div>
          <motion.span
            className="label"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{ display: 'block', marginBottom: '1.5rem' }}
          >
            Get in touch
          </motion.span>

          <motion.h2
            className="display-lg"
            initial={reducedMotion ? {} : { opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: 'var(--text)', marginBottom: '1.5rem' }}
          >
            Let's build something unforgettable.
          </motion.h2>

          <motion.p
            className="body-lg"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}
          >
            Tell us about your project. We respond within 24 hours and are quick to say if something isn't right for us — so you never waste time.
          </motion.p>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <a
              href="mailto:hello@elizadigital.com"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s',
              }}
            >
              <Mail size={16} color="var(--brand)" />
              hello@elizadigital.com
            </a>
            <a
              href="tel:+1234567890"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s',
              }}
            >
              <Phone size={16} color="var(--brand)" />
              +1 (234) 567-890
            </a>
          </motion.div>
        </div>

        {/* Right — Form */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {formState === 'success' ? (
            <div
              className="card-elevated"
              style={{ textAlign: 'center', padding: '4rem 2rem' }}
              role="status"
              aria-live="polite"
            >
              <span
                style={{
                  fontSize: '2.5rem',
                  display: 'block',
                  marginBottom: '1rem',
                }}
              >
                ✓
              </span>
              <h3
                className="display-sm"
                style={{ color: 'var(--text)', marginBottom: '0.75rem' }}
              >
                Message received.
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                We'll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                  }}
                >
                  Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  style={inputStyle(!!errors.name)}
                  onFocus={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = 'var(--brand)')
                  }
                  onBlur={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = errors.name
                      ? 'var(--video)'
                      : 'var(--border-strong)')
                  }
                  placeholder="Your name"
                />
                {errors.name && (
                  <span
                    id="name-error"
                    role="alert"
                    aria-live="polite"
                    style={{ fontSize: '0.78rem', color: 'var(--video)', marginTop: '0.3rem', display: 'block' }}
                  >
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                  }}
                >
                  Email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  style={inputStyle(!!errors.email)}
                  onFocus={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = 'var(--brand)')
                  }
                  onBlur={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = errors.email
                      ? 'var(--video)'
                      : 'var(--border-strong)')
                  }
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <span
                    id="email-error"
                    role="alert"
                    aria-live="polite"
                    style={{ fontSize: '0.78rem', color: 'var(--video)', marginTop: '0.3rem', display: 'block' }}
                  >
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                  }}
                >
                  Tell us about your project *
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  style={{
                    ...inputStyle(!!errors.message),
                    resize: 'vertical',
                    minHeight: 130,
                  }}
                  onFocus={(e) =>
                    ((e.target as HTMLTextAreaElement).style.borderColor = 'var(--brand)')
                  }
                  onBlur={(e) =>
                    ((e.target as HTMLTextAreaElement).style.borderColor = errors.message
                      ? 'var(--video)'
                      : 'var(--border-strong)')
                  }
                  placeholder="What are you building? What's the goal?"
                />
                {errors.message && (
                  <span
                    id="message-error"
                    role="alert"
                    aria-live="polite"
                    style={{ fontSize: '0.78rem', color: 'var(--video)', marginTop: '0.3rem', display: 'block' }}
                  >
                    {errors.message}
                  </span>
                )}
              </div>

              {formState === 'error' && (
                <p
                  role="alert"
                  style={{ fontSize: '0.875rem', color: 'var(--video)' }}
                >
                  Something went wrong. Please email us directly at hello@elizadigital.com
                </p>
              )}

              <button
                type="submit"
                disabled={formState === 'sending'}
                className="btn-primary"
                style={{
                  justifyContent: 'center',
                  opacity: formState === 'sending' ? 0.7 : 1,
                }}
              >
                {formState === 'sending' ? 'Sending...' : 'Send message'}
                {formState !== 'sending' && <ArrowRight size={16} />}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          #contact > div {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
