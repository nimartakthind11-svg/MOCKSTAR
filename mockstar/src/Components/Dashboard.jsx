import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

/* ── Theme Toggle button ─────────────────────────────────────── */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
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
  );
};

/* ── Dashboard Navbar ────────────────────────────────────────── */
const DashboardNav = ({ userProfile, onLogout, onEditProfile, activeTab, onTabChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "overview", label: "Overview", icon: "⊡" },
    { id: "sessions", label: "Sessions", icon: "◷" },
    { id: "profile", label: "Profile", icon: "◉" },
  ];

  return (
    <nav
      style={{
        background: "var(--bg-nav)",
        borderBottom: "1px solid var(--border)",
      }}
      className="w-full sticky top-0 z-40 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2 select-none">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent)" }} />
          <span
            className="font-mono text-base tracking-wide font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Mockstar
          </span>
        </div>

        {/* Center nav tabs (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                  background: isActive ? "var(--nav-active-bg)" : "transparent",
                  borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                }}
                className="px-4 py-2 rounded-t-md text-sm font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:opacity-90"
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Avatar chip */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{
              border: "1.5px solid var(--border)",
              color: "var(--text-muted)",
              background: "var(--bg-card)",
            }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--accent)" }}
            >
              {(userProfile?.username || "U")[0].toUpperCase()}
            </span>
            <span style={{ color: "var(--text-primary)" }}>{userProfile?.username || "User"}</span>
          </div>

          {userProfile?.isBuilt && (
            <button
              onClick={onEditProfile}
              className="hidden md:block text-sm font-medium transition-colors cursor-pointer"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => e.target.style.color = "var(--accent)"}
              onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={onLogout}
            className="text-sm font-medium transition-colors cursor-pointer"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => e.target.style.color = "var(--accent)"}
            onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
          >
            Logout
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-xl cursor-pointer"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden flex flex-col px-6 pb-4 gap-2 animate-fadeIn"
          style={{ background: "var(--bg-nav)", borderTop: "1px solid var(--border)" }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setMobileOpen(false); }}
              style={{
                color: activeTab === item.id ? "var(--accent)" : "var(--text-muted)",
                background: activeTab === item.id ? "var(--nav-active-bg)" : "transparent",
              }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

/* ── Stat Card ───────────────────────────────────────────────── */
const StatCard = ({ label, value, icon }) => (
  <div
    className="rounded-xl p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-card)",
    }}
  >
    <div className="flex items-center justify-between">
      <h3
        className="text-xs font-mono uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </h3>
      <span className="text-lg">{icon}</span>
    </div>
    <p
      className="text-xl font-mono font-semibold h-8 truncate"
      style={{ color: "var(--text-primary)" }}
    >
      {value}
    </p>
  </div>
);

/* ── Overview Tab ────────────────────────────────────────────── */
const OverviewTab = ({ userProfile, sessions, onUploadResume, onStartSession, onEditProfile, onTabChange }) => (
  <div className="flex flex-col gap-8 animate-fadeIn">
    {/* Profile Incomplete Banner */}
    {!userProfile?.isBuilt && (
      <div
        className="rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          background: "rgba(166,87,63,0.08)",
          border: "1px solid rgba(166,87,63,0.28)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Your profile is incomplete. Build your profile to unlock focus domains and stats.
          </span>
        </div>
        <button
          onClick={onEditProfile}
          className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors"
          style={{ background: "var(--accent)", color: "#F4F5F2" }}
        >
          Build Profile
        </button>
      </div>
    )}

    {/* Welcome */}
    <div>
      <h1 className="text-5xl font-serif font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
        Welcome, {userProfile?.username || "User"}
      </h1>
      <p className="mt-2 font-mono text-sm uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {userProfile?.isBuilt ? `Domain: ${userProfile.focusDomain}` : "Domain: Not Set"}
      </p>
    </div>

    {/* Stat cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="Focus Domain" value={userProfile?.isBuilt ? userProfile.focusDomain : "—"} />
      <StatCard label="Core Skills" value={userProfile?.isBuilt ? userProfile.coreSkills : "—"} />
      <StatCard label="Total Sessions" value={sessions.length > 0 ? sessions.length : "—"} />
    </div>

    {/* Action buttons */}
    <div className="flex flex-wrap items-center gap-4">
      {userProfile?.isBuilt ? (
        <button
          onClick={onUploadResume}
          className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer"
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
          Upload Resume
        </button>
      ) : (
        <button
          onClick={onEditProfile}
          className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer"
          style={{
            border: "1.5px solid var(--accent)",
            color: "var(--accent)",
            background: "transparent",
          }}
        >
          Build Profile
        </button>
      )}

      <button
        onClick={onStartSession}
        className="px-8 py-3.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer shadow-md"
        style={{ background: "var(--accent)", color: "#F4F5F2" }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--accent-hover)"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
      >
        Start Practice Session →
      </button>
    </div>

    {/* Recent sessions preview */}
    <div className="flex flex-col gap-4 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-semibold" style={{ color: "var(--text-primary)" }}>
          Recent Sessions
        </h2>
        {sessions.length > 0 && (
          <button
            onClick={() => onTabChange("sessions")}
            className="text-sm font-medium transition-colors cursor-pointer"
            style={{ color: "var(--accent)" }}
          >
            View all →
          </button>
        )}
      </div>
      <SessionList sessions={sessions.slice(0, 3)} />
    </div>
  </div>
);

/* ── Sessions Tab ────────────────────────────────────────────── */
const SessionList = ({ sessions }) => (
  <div
    className="rounded-xl overflow-hidden"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-card)",
    }}
  >
    {sessions.length > 0 ? (
      <div style={{ borderColor: "var(--border)" }} className="divide-y">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-150"
            style={{ borderColor: "var(--border)" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--nav-active-bg)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div>
              <h4 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                {session.role}
              </h4>
              <p className="text-xs mt-1 font-mono" style={{ color: "var(--text-muted)" }}>
                Completed on: {session.date}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Score:</span>
              <span className="font-mono text-lg font-bold" style={{ color: session.scoreColor }}>
                {session.score}/100
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="p-10 flex flex-col items-center justify-center gap-3 text-center">
        <div
          className="w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center"
          style={{ borderColor: "var(--border)" }}
        >
          <span style={{ color: "var(--border)", fontSize: "1.2rem", lineHeight: 1 }}>—</span>
        </div>
        <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
          No sessions yet. Start practicing to see your history here.
        </p>
      </div>
    )}
  </div>
);

const SessionsTab = ({ sessions }) => (
  <div className="flex flex-col gap-6 animate-fadeIn pb-12">
    <div>
      <h2 className="text-3xl font-serif font-bold" style={{ color: "var(--text-primary)" }}>
        All Sessions
      </h2>
      <p className="text-sm mt-1 font-mono" style={{ color: "var(--text-muted)" }}>
        {sessions.length} session{sessions.length !== 1 ? "s" : ""} completed
      </p>
    </div>
    <SessionList sessions={sessions} />
  </div>
);

/* ── Profile Tab ─────────────────────────────────────────────── */
const ProfileTab = ({ userProfile, onEditProfile }) => (
  <div className="flex flex-col gap-6 animate-fadeIn pb-12">
    <div>
      <h2 className="text-3xl font-serif font-bold" style={{ color: "var(--text-primary)" }}>
        My Profile
      </h2>
    </div>
    <div
      className="rounded-xl p-8 flex flex-col gap-6"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
    >
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{ background: "var(--accent)" }}
        >
          {(userProfile?.username || "U")[0].toUpperCase()}
        </div>
        <div>
          <p className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            {userProfile?.username || "User"}
          </p>
          <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
            {userProfile?.isBuilt ? "Profile complete" : "Profile incomplete"}
          </p>
        </div>
      </div>

      <hr style={{ borderColor: "var(--border)" }} />

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Focus Domain", value: userProfile?.focusDomain || "Not set" },
          { label: "Core Skills", value: userProfile?.coreSkills || "Not set" },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              {label}
            </span>
            <span className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={onEditProfile}
          className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer"
          style={{ background: "var(--accent)", color: "#F4F5F2" }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--accent-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
        >
          {userProfile?.isBuilt ? "Edit Profile" : "Build Profile"}
        </button>
      </div>
    </div>
  </div>
);

/* ── Dashboard Root ──────────────────────────────────────────── */
const Dashboard = ({
  onLogout,
  userProfile,
  onEditProfile,
  onUploadResume,
  onStartSession,
  sessions = [],
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div
      className="min-h-screen flex flex-col animate-fadeIn transition-colors duration-300"
      style={{ background: "var(--bg-primary)" }}
    >
      <DashboardNav
        userProfile={userProfile}
        onLogout={onLogout}
        onEditProfile={onEditProfile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-1 flex flex-col gap-8">
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
