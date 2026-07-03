import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onAuthClick }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav
      className="w-full flex items-center justify-between px-16 py-8 transition-colors duration-300"
      style={{ color: "var(--text-primary)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 select-none">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent)" }} />
        <span
          className="font-mono text-lg tracking-wide font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Mockstar by Mocktane
        </span>
      </div>

      {/* Center link */}
      <div className="flex gap-8 text-lg" style={{ color: "var(--text-muted)" }}>
        <a
          href="mailto:mocktane@gmail.com"
          className="transition-colors hover:underline"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
          onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
        >
          for queries: mocktane@gmail.com
        </a>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
        >
          <span className="theme-toggle__thumb">
            {isDark ? "🌙" : "☀️"}
          </span>
        </button>

        {/* Auth button */}
        <button
          onClick={onAuthClick}
          className="px-5 py-2 rounded-md text-base font-semibold transition-all duration-200 cursor-pointer"
          style={{
            border: "1.5px solid var(--text-primary)",
            color: "var(--text-primary)",
            background: "transparent",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "var(--text-primary)";
            e.currentTarget.style.color = "var(--bg-primary)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
        >
          Log in / Sign up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
