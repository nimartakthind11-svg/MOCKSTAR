import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

/* ── Logo component (reusable) ── */
const Logo = ({ size = "sm" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size === "sm" ? 8 : 10, userSelect: "none" }}>
    <div
      style={{
        width: size === "sm" ? 26 : 32,
        height: size === "sm" ? 26 : 32,
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)",
        boxShadow: "0 0 12px var(--accent-glow)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size === "sm" ? 10 : 13} height={size === "sm" ? 10 : 13} viewBox="0 0 12 12" fill="none">
        <path d="M6 1L7.8 4.2L11 4.8L8.6 7.2L9.2 10.5L6 8.8L2.8 10.5L3.4 7.2L1 4.8L4.2 4.2L6 1Z" fill="white" />
      </svg>
    </div>
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
      <span style={{ fontFamily: "'Fraunces', serif", fontSize: size === "sm" ? 16 : 20, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Mockstar</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>by Mocktane</span>
    </div>
  </div>
);

/* ── Theme Toggle ── */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button className="theme-toggle" onClick={toggleTheme} title={isDark ? "Light mode" : "Dark mode"} aria-label="Toggle theme">
      <span className="theme-toggle__thumb">{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
};

/* ── Dashboard Navbar ── */
const DashboardNav = ({ userProfile, onLogout, onEditProfile, activeTab, onTabChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { id: "overview", label: "Overview", icon: (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>) },
    { id: "sessions", label: "Sessions", icon: (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>) },
    { id: "profile", label: "Profile", icon: (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>) },
  ];

  return (
    <nav className="ms-glass" style={{ position: "sticky", top: 0, zIndex: 100, boxShadow: "var(--shadow-xs)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <Logo />

        {/* Center tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--bg-subtle)", borderRadius: 12, padding: 4 }} className="hide-mobile">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 16px",
                  borderRadius: 9,
                  border: "none",
                  background: isActive ? "var(--bg-card)" : "transparent",
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isActive ? "var(--shadow-xs)" : "none",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle />

          {/* Avatar chip */}
          <div
            className="hide-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px 6px 6px",
              borderRadius: 999,
              border: "1.5px solid var(--border)",
              background: "var(--bg-card)",
              cursor: "default",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F8F5F2",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {(userProfile?.username || "U")[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{userProfile?.username || "User"}</span>
          </div>

          {userProfile?.isBuilt && (
            <button
              onClick={onEditProfile}
              className="hide-mobile"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "var(--accent)"}
              onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={onLogout}
            style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "var(--accent)"}
            onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
          >
            Logout
          </button>

          <button
            onClick={() => setMobileOpen(o => !o)}
            style={{ display: "none", fontSize: 20, color: "var(--text-primary)", background: "none", border: "none", cursor: "pointer" }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="animate-slideDown" style={{ background: "var(--bg-nav)", borderTop: "1px solid var(--border)", padding: "12px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setMobileOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, border: "none", background: activeTab === item.id ? "var(--nav-active-bg)" : "transparent", color: activeTab === item.id ? "var(--accent)" : "var(--text-muted)", fontSize: 14, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

/* ── Stat Card ── */
const StatCard = ({ label, value, icon, color }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 20,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-sm)",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontWeight: 600 }}>
          {label}
        </span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "var(--accent-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent)",
          }}
        >
          {icon}
        </div>
      </div>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 20,
          fontWeight: 600,
          color: color || "var(--text-primary)",
          lineHeight: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </p>
    </div>
  );
};

/* ── Session List ── */
const SessionList = ({ sessions }) => (
  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
    {sessions.length > 0 ? (
      <div>
        {sessions.map((session, i) => (
          <div
            key={session.id}
            style={{
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              borderBottom: i < sessions.length - 1 ? "1px solid var(--border)" : "none",
              transition: "background 0.15s ease",
              cursor: "default",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-subtle)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 3px" }}>{session.role}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{session.date}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div
                style={{
                  padding: "4px 14px",
                  borderRadius: 999,
                  background: `${session.scoreColor}18`,
                  border: `1.5px solid ${session.scoreColor}40`,
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: session.scoreColor }}>
                  {session.score}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text-muted)", marginLeft: 2 }}>/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ padding: "56px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "2px dashed var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="22" height="22" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px" }}>No sessions yet</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Start practicing to see your history here.</p>
        </div>
      </div>
    )}
  </div>
);

/* ── Overview Tab ── */
const OverviewTab = ({ userProfile, sessions, onUploadResume, onStartSession, onEditProfile, onTabChange }) => (
  <div className="animate-fadeIn" style={{ display: "flex", flexDirection: "column", gap: 32 }}>

    {/* Profile incomplete banner */}
    {!userProfile?.isBuilt && (
      <div
        style={{
          background: "var(--accent-soft)",
          border: "1px solid var(--accent-medium)",
          borderRadius: 16,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--accent-medium)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-primary)" }}>
            Your profile is incomplete. Build your profile to unlock domains and stats.
          </span>
        </div>
        <button
          onClick={onEditProfile}
          style={{ padding: "8px 18px", background: "var(--accent)", color: "#F8F5F2", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--accent-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
        >
          Build Profile →
        </button>
      </div>
    )}

    {/* Welcome header */}
    <div>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 8 }}>
        Dashboard
      </p>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 500, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0, lineHeight: 1.15 }}>
        Welcome, {userProfile?.username || "there"} 
      </h1>
      <p style={{ marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
        {userProfile?.isBuilt ? `Domain: ${userProfile.focusDomain}` : "Domain: Not Set"}
      </p>
    </div>

    {/* Stat cards */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
      <StatCard
        label="Focus Domain"
        value={userProfile?.isBuilt ? userProfile.focusDomain : "—"}
        icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>}
      />
      <StatCard
        label="Core Skills"
        value={userProfile?.isBuilt ? userProfile.coreSkills : "—"}
        icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>}
      />
      <StatCard
        label="Total Sessions"
        value={sessions.length > 0 ? `${sessions.length}` : "—"}
        icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
      />
    </div>

    {/* Action buttons */}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {userProfile?.isBuilt ? (
        <button
          onClick={onUploadResume}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "transparent", color: "var(--text-primary)", border: "1.5px solid var(--border-strong)", borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-primary)"; }}
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload Resume
        </button>
      ) : (
        <button
          onClick={onEditProfile}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "transparent", color: "var(--accent)", border: "1.5px solid var(--accent)", borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-soft)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          Build Profile
        </button>
      )}
      <button
        onClick={onStartSession}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "var(--accent)", color: "#F8F5F2", border: "none", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.25s ease", boxShadow: "0 4px 16px var(--accent-glow)" }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-hover)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px var(--accent-glow)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px var(--accent-glow)"; }}
      >
        Start Practice Session
        <span>→</span>
      </button>
    </div>

    {/* Recent sessions */}
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>
          Recent Sessions
        </h2>
        {sessions.length > 0 && (
          <button
            onClick={() => onTabChange("sessions")}
            style={{ fontSize: 13, fontWeight: 500, color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}
          >
            View all →
          </button>
        )}
      </div>
      <SessionList sessions={sessions.slice(0, 3)} />
    </div>
  </div>
);

/* ── Sessions Tab ── */
const SessionsTab = ({ sessions }) => (
  <div className="animate-fadeIn" style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 48 }}>
    <div>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 8 }}>History</p>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 500, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>All Sessions</h2>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
        {sessions.length} session{sessions.length !== 1 ? "s" : ""} completed
      </p>
    </div>
    <SessionList sessions={sessions} />
  </div>
);

/* ── Profile Tab ── */
const ProfileTab = ({ userProfile, onEditProfile }) => {
  const isBuilt = userProfile?.isBuilt;
  return (
    <div className="animate-fadeIn" style={{ display: "flex", flexDirection: "column", gap: 32, paddingBottom: 48 }}>
      {/* Header Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent)", fontWeight: 600 }}>Account</p>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 2.5rem)", fontWeight: 500, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>My Profile</h2>
      </div>

      {/* Profile Card */}
      <div style={{
        position: "relative",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 32,
        padding: "48px",
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        flexDirection: "column",
        gap: 40
      }}>
        {/* Decorative Background Blob */}
        <div style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          background: "radial-gradient(circle, var(--accent-alpha-12) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        {/* Top Profile Info Section */}
        <div style={{ display: "flex", alignItems: "center", gap: 28, zIndex: 1 }}>
          {/* Avatar with Glow */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              inset: -8,
              background: "linear-gradient(135deg, var(--accent-alpha-40), transparent)",
              borderRadius: "50%",
              filter: "blur(12px)",
              opacity: 0.8,
            }} />
            <div style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              fontSize: 36,
              fontWeight: 700,
              fontFamily: "'Fraunces', serif",
              border: "4px solid var(--bg-card)",
              position: "relative",
              boxShadow: "var(--shadow-md)"
            }}>
              {(userProfile?.username || "U")[0].toUpperCase()}
            </div>
          </div>
          
          {/* User Meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <h3 style={{ fontSize: 28, fontWeight: 600, color: "var(--text-primary)", margin: 0, fontFamily: "'Fraunces', serif", letterSpacing: "-0.01em" }}>
              {userProfile?.username || "User"}
            </h3>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-subtle)", padding: "6px 12px", borderRadius: 999, width: "fit-content", border: "1px solid var(--border-strong)" }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isBuilt ? "#10b981" : "var(--accent)",
                boxShadow: `0 0 8px ${isBuilt ? "rgba(16, 185, 129, 0.4)" : "var(--accent-glow)"}`,
              }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                {isBuilt ? "Profile complete" : "Profile incomplete"}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--border), transparent)", opacity: 0.8 }} />

        {/* Detailed Stats / Info */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32, zIndex: 1 }}>
          {[
            { 
              label: "Email", 
              value: userProfile?.email || "Not set",
              icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            },
            { 
              label: "Focus Domain", 
              value: userProfile?.focusDomain || "Not set",
              icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
            },
            { 
              label: "Core Skills", 
              value: userProfile?.coreSkills || "Not set",
              icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            },
            { 
              label: "College / University", 
              value: userProfile?.college || "Not set",
              icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            },
            { 
              label: "Course", 
              value: userProfile?.course || "Not set",
              icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 12, 
              background: "var(--bg-subtle)", 
              padding: "24px", 
              borderRadius: 20,
              border: "1px solid var(--border-strong)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--accent-alpha-50)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--accent)" }}>
                {icon}
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                  {label}
                </span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.5 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div style={{ zIndex: 1, marginTop: 8 }}>
          <button
            onClick={onEditProfile}
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              justifyContent: "center",
              gap: 10, 
              padding: "16px 36px", 
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)", 
              color: "#FFF", 
              border: "none", 
              borderRadius: 999, 
              fontSize: 16, 
              fontWeight: 600, 
              cursor: "pointer", 
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
              boxShadow: "0 8px 24px var(--accent-glow)" 
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 32px var(--accent-glow)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 8px 24px var(--accent-glow)"; }}
          >
            {isBuilt ? "Edit Profile" : "Build Profile"}
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Dashboard Root ── */
const Dashboard = ({ onLogout, userProfile, onEditProfile, onUploadResume, onStartSession, sessions = [] }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="animate-fadeIn" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)", transition: "background 0.3s ease" }}>
      <DashboardNav
        userProfile={userProfile}
        onLogout={onLogout}
        onEditProfile={onEditProfile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main style={{ maxWidth: 1100, margin: "0 auto", width: "100%", padding: "40px 32px", flex: 1 }}>
        {activeTab === "overview" && (
          <OverviewTab
            userProfile={userProfile}
            sessions={sessions}
            onUploadResume={onUploadResume}
            onStartSession={onStartSession}
            onEditProfile={onEditProfile}
            onTabChange={setActiveTab}
          />
        )}
        {activeTab === "sessions" && <SessionsTab sessions={sessions} />}
        {activeTab === "profile" && <ProfileTab userProfile={userProfile} onEditProfile={onEditProfile} />}
      </main>
    </div>
  );
};

export default Dashboard;
