import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onAuthClick }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [activeLink, setActiveLink] = useState('how-it-works');

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setActiveLink(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', top: 0, zIndex: 100 }}>
      <nav
        style={{
          width: '100%',
          maxWidth: 1200,
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Mockstar
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, color: 'var(--text-muted)' }}>
              by Mocktane
            </span>
          </div>
        </div>

        {/* Center: Links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { label: 'How it works', id: 'how-it-works' },
            { label: 'Features', id: 'features' },
            { label: 'FAQ', id: 'faq' },
            { label: 'Contact : mocktane@gmail.com', id: 'contact' }
          ].map((link) => {
            const isActive = activeLink === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 6,
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.target.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.target.style.color = 'var(--text-muted)';
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Theme Toggle inside a pill */}
          <div style={{ background: 'var(--accent-soft)', padding: '4px', borderRadius: 999, display: 'flex' }}>
            <button
              onClick={toggleTheme}
              style={{
                background: isDark ? 'transparent' : '#fff',
                border: 'none', borderRadius: 999, width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'all 0.2s', fontSize: 14
              }}
            >
              ☀️
            </button>
            <button
              onClick={toggleTheme}
              style={{
                background: isDark ? '#2A2D30' : 'transparent',
                border: 'none', borderRadius: 999, width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: isDark ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 0.2s', fontSize: 14
              }}
            >
              🌙
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => onAuthClick('login')}
              style={{
                padding: '8px 18px', background: 'transparent', color: 'var(--text-primary)',
                border: '1px solid var(--border-strong)', borderRadius: 8,
                fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-soft)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Log in
            </button>
            <button
              onClick={() => onAuthClick('signup')}
              style={{
                padding: '8px 20px', background: 'var(--accent)', color: '#F8F5F2',
                border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                cursor: 'pointer', transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px var(--accent-glow)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Get started
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
