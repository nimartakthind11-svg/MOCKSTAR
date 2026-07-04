import React, { useState, useEffect, useRef } from 'react';

/* ─── tiny hook: triggers once when element enters viewport ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── section fade-in wrapper ─── */
function FadeIn({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Stats strip ─── */
const STATS = [
  { icon: '⬡', label: 'Domains', value: 'Multiple', sub: 'Data Sci · Web · DevOps' },
  { icon: '◈', label: 'Questions', value: '100+', sub: 'Across all domains' },
  { icon: '⬙', label: 'Difficulty levels', value: '3', sub: 'Easy · Medium · Hard' },
  { icon: '◉', label: 'Integrity tracking', value: 'Live', sub: 'Every session' },
];

function StatsPill({ icon, label, value, sub, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 24px',
          borderRadius: 100,
          border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border, #DCDAD2)'}`,
          background: hovered ? 'var(--accent-soft, #F2E4DD)' : 'var(--surface, #fff)',
          cursor: 'default',
          transition: 'all 0.22s ease',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          boxShadow: hovered ? '0 8px 24px rgba(166,87,63,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        {/* Icon circle */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: hovered ? 'var(--accent)' : 'var(--accent-soft, #F2E4DD)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
          color: hovered ? '#F4F5F2' : 'var(--accent)',
          transition: 'all 0.22s ease',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        {/* Text */}
        <div>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 20,
            fontWeight: 600,
            color: hovered ? 'var(--accent)' : 'var(--text-primary)',
            lineHeight: 1.1,
            transition: 'color 0.22s ease',
          }}>
            {value}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── Divider ─── */
const Divider = () => (
  <div style={{ height: '0.5px', background: 'var(--border, #DCDAD2)', margin: '0 40px' }} />
);

/* ─── Section heading ─── */
function SectionHead({ tag, title }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 40 }}>
      <span style={{
        fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
        color: 'var(--accent)', display: 'block', marginBottom: 8,
      }}>{tag}</span>
      <h2 style={{
        fontFamily: 'Georgia, Source Serif 4, serif',
        fontSize: 28, fontWeight: 400,
        color: 'var(--text-primary)',
      }}>{title}</h2>
    </div>
  );
}

/* ─── How it works ─── */
const STEPS = [
  {
    num: '01',
    title: 'Upload your resume',
    desc: 'We read it, extract your skills, and automatically predict your domain — no manual input needed.',
    icon: '↑',
  },
  {
    num: '02',
    title: 'Practice live',
    desc: 'Pick interview type, difficulty, and question count. Answer one at a time, just like the real thing.',
    icon: '◎',
  },
  {
    num: '03',
    title: 'Get your report',
    desc: 'Full transcript, a performance score, and an honesty score so you know exactly where you stand.',
    icon: '✓',
  },
];

function StepCard({ num, title, desc, icon, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? 'var(--accent-soft, #F2E4DD)' : 'var(--surface, #fff)',
          border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border, #DCDAD2)'}`,
          borderRadius: 14,
          padding: '28px 24px',
          transition: 'all 0.25s ease',
          transform: hovered ? 'translateY(-4px)' : 'none',
          boxShadow: hovered ? '0 12px 32px rgba(166,87,63,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--accent)',
            color: '#F4F5F2', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{num}</div>
          <span style={{ fontSize: 22, color: 'var(--accent)', opacity: 0.35 }}>{icon}</span>
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>{desc}</p>
      </div>
    </FadeIn>
  );
}

/* ─── Features ─── */
const FEATURES = [
  { icon: '◈', title: 'Resume-matched questions', desc: 'Questions adapt to your actual extracted skills and predicted domain.' },
  { icon: '◉', title: 'Integrity monitoring', desc: 'Tab switches, paste attempts, and fullscreen exits are all tracked live.' },
  { icon: '◎', title: 'Chat-style interview', desc: 'One question at a time, no distractions — just like talking to a real interviewer.' },
  { icon: '⬡', title: 'Session reports', desc: 'Full Q&A transcript with scores, so you can actually review and improve.' },
];

function FeatureCard({ icon, title, desc, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', gap: 16, alignItems: 'flex-start',
          background: 'var(--surface, #fff)',
          border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border, #DCDAD2)'}`,
          borderRadius: 14, padding: '20px',
          transition: 'all 0.22s ease',
          transform: hovered ? 'translateY(-3px)' : 'none',
          boxShadow: hovered ? '0 8px 24px rgba(166,87,63,0.08)' : 'none',
        }}
      >
        <div style={{
          width: 38, height: 38, flexShrink: 0,
          borderRadius: 10,
          background: hovered ? 'var(--accent)' : 'var(--accent-soft, #F2E4DD)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: hovered ? '#F4F5F2' : 'var(--accent)',
          transition: 'all 0.22s ease',
        }}>{icon}</div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 5 }}>{title}</h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── Domains ─── */
const DOMAINS = [
  { label: 'Data Science', color: '#2F6F66' },
  { label: 'Web Development', color: '#A6573F' },
  { label: 'DevOps', color: '#1C2127' },

];

function DomainPill({ label, color, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 26px', borderRadius: 100,
          border: `1px solid ${hovered ? color : 'var(--border, #DCDAD2)'}`,
          background: hovered ? color + '14' : 'var(--surface, #fff)',
          cursor: 'default',
          transition: 'all 0.22s ease',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
        }}
      >
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: color,
          transition: 'transform 0.22s ease',
          transform: hovered ? 'scale(1.4)' : 'scale(1)',
          display: 'inline-block',
        }} />
        <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 2 }}>→</span>
      </div>
    </FadeIn>
  );
}

/* ─── FAQ ─── */
const FAQS = [
  { q: 'Is my resume data safe?', a: 'Yes — your resume is only used to extract skills and predict your domain. It isn\'t stored permanently or shared anywhere.' },
  { q: 'Is Mockstar free to use?', a: 'Yes, completely free during this build phase. Pricing may come in later versions.' },
  { q: 'How accurate is the domain prediction?', a: 'It uses keyword matching right now — solid for clear profiles. A trained ML model (Logistic Regression) is the planned upgrade next phase.' },
  { q: 'Can I retake an interview in the same domain?', a: 'Yes — each session draws from a randomized question set, so no two interviews feel the same.' },
];

function FAQItem({ q, a, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'var(--surface, #fff)',
          border: `1px solid ${open ? 'var(--accent)' : 'var(--border, #DCDAD2)'}`,
          borderRadius: 12, padding: '16px 20px',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{q}</span>
          <span style={{
            fontSize: 20, color: 'var(--accent)',
            transform: open ? 'rotate(45deg)' : 'rotate(0)',
            transition: 'transform 0.25s ease',
            lineHeight: 1,
          }}>+</span>
        </div>
        <div style={{
          overflow: 'hidden',
          maxHeight: open ? '200px' : '0',
          opacity: open ? 1 : 0,
          transition: 'max-height 0.35s ease, opacity 0.25s ease',
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.65 }}>{a}</p>
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── Footer steps ─── */
function FooterSteps() {
  const steps = ['Upload Resume', 'Practice Live', 'Get Your Report'];
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      gap: 0, padding: '24px 0',
      borderTop: '0.5px solid var(--border, #DCDAD2)',
    }}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 28px' }}>
            <span style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'var(--accent)', color: '#F4F5F2',
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>0{i + 1}</span>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <span style={{ color: 'var(--accent)', fontSize: 16, opacity: 0.4 }}>→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* MAIN LANDING PAGE */
export default function Landing({ onAuthClick, onStartPractice }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* ── FooterSteps ── */}
      <FooterSteps />

      {/* STATS STRIP*/}
      <div style={{
        borderTop: '0.5px solid var(--border, #DCDAD2)',
        borderBottom: '0.5px solid var(--border, #DCDAD2)',
        padding: '32px 40px',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: 14, flexWrap: 'wrap',
        }}>
          {STATS.map((s, i) => (
            <StatsPill key={s.label} {...s} delay={i * 0.07} />
          ))}
        </div>
      </div>

      {/*  HOW IT WORKS */}
      <section style={{ padding: '72px 60px' }}>
        <FadeIn><SectionHead tag="How it works" title="Three steps, no surprises." /></FadeIn>
        <div style={{ display: 'flex', gap: 16, maxWidth: 900, margin: '0 auto' }}>
          {STEPS.map((s, i) => <StepCard key={s.num} {...s} delay={i * 0.1} />)}
        </div>
      </section>

      <Divider />

      {/* FEATURES */}
      <section style={{ padding: '72px 60px' }}>
        <FadeIn><SectionHead tag="Why Mockstar" title="Built to feel like the real thing." /></FadeIn>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 14, maxWidth: 820, margin: '0 auto',
        }}>
          {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} delay={i * 0.08} />)}
        </div>
      </section>

      <Divider />

      {/* DOMAINS */}
      <section style={{ padding: '72px 60px', textAlign: 'center' }}>
        <FadeIn><SectionHead tag="Domains" title="Pick your field." /></FadeIn>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          {DOMAINS.map((d, i) => <DomainPill key={d.label} {...d} delay={i * 0.1} />)}
        </div>
      </section>

      <Divider />

      {/* FAQ */}
      <section style={{ padding: '72px 60px' }}>
        <FadeIn><SectionHead tag="FAQ" title="Questions people ask first." /></FadeIn>
        <div style={{
          maxWidth: 620, margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {FAQS.map((f, i) => <FAQItem key={f.q} {...f} delay={i * 0.07} />)}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section style={{ padding: '0 60px 80px' }}>
        <FadeIn>
          <div style={{
            background: '#1C2127', borderRadius: 18,
            padding: '52px 40px', textAlign: 'center',
          }}>
            <h2 style={{
              fontFamily: 'Georgia, Source Serif 4, serif',
              fontSize: 28, fontWeight: 400,
              color: '#F4F5F2', marginBottom: 10,
            }}>
              Ready to stop winging it?
            </h2>
            <p style={{ fontSize: 14, color: '#888780', marginBottom: 28 }}>
              Takes two minutes to set up. No credit card, no fluff.
            </p>
            <CtaButton onClick={onStartPractice} />
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '0.5px solid var(--border, #DCDAD2)',
        padding: '24px 60px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          Mockstar by Mocktane
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>mocktane@gmail.com</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2026 Mocktane</span>
      </footer>

    </div>
  );
}

/* ─── small inline CTA button with hover ─── */
function CtaButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#c4694f' : 'var(--accent)',
        color: '#F4F5F2',
        border: 'none', borderRadius: 8,
        padding: '13px 32px', fontSize: 15, fontWeight: 600,
        cursor: 'pointer',
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? '0 8px 24px rgba(166,87,63,0.35)' : 'none',
      }}
    >
      Start practicing →
    </button>
  );
}
