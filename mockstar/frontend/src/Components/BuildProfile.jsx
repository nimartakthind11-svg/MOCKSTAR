import React, { useState } from "react";
import { profileApi } from "../utils/api";

const BuildProfile = ({ initialProfile, onSave, onCancel }) => {
  const [username, setUsername] = useState(initialProfile.username || "");
  const [focusDomain, setFocusDomain] = useState(initialProfile.focusDomain || "");
  const [coreSkills, setCoreSkills] = useState(initialProfile.coreSkills || "");
  const [college, setCollege] = useState(initialProfile.college || "");
  const [course, setCourse] = useState(initialProfile.course || "");
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !focusDomain.trim() || !coreSkills.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setIsLoading(true);
    setApiError("");
    try {
      const updated = await profileApi.update(
        username.trim(),
        focusDomain.trim(),
        coreSkills.trim(),
        college.trim(),
        course.trim()
      );
      onSave({
        username: updated.username,
        email: initialProfile.email || "",
        focusDomain: updated.focus_domain || focusDomain.trim(),
        coreSkills: updated.core_skills || coreSkills.trim(),
        college: updated.college || college.trim(),
        course: updated.course || course.trim(),
        isBuilt: updated.is_built,
      });
    } catch (err) {
      setApiError(err.message || "Failed to save profile. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      id: "email",
      label: "Email Address",
      placeholder: "jane@example.com",
      value: initialProfile.email || "",
      set: () => { }, // read-only
      disabled: true,
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      ),
    },
    {
      id: "username",
      label: "Username / Full Name",
      placeholder: "e.g. Jane Smith",
      value: username,
      set: setUsername,
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: "focusDomain",
      label: "Focus Domain",
      placeholder: "e.g. Frontend Development",
      value: focusDomain,
      set: setFocusDomain,
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
      ),
    },
    {
      id: "coreSkills",
      label: "Core Skills",
      placeholder: "e.g. React, CSS, JavaScript",
      value: coreSkills,
      set: setCoreSkills,
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
    },
    {
      id: "college",
      label: "College / University",
      placeholder: "e.g. University of Delhi",
      value: college,
      set: setCollege,
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      id: "course",
      label: "Course",
      placeholder: "e.g. B.Tech Computer Science",
      value: course,
      set: setCourse,
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="animate-fadeIn"
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        transition: "background 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, var(--accent-alpha-12) 0%, transparent 60%)",
          pointerEvents: "none",
          filter: "blur(60px)",
          transform: "translate(-50%, -50%)"
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, var(--accent-alpha-08) 0%, transparent 60%)",
          pointerEvents: "none",
          filter: "blur(80px)",
          transform: "translate(50%, 50%)"
        }}
      />

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
            boxShadow: "0 0 24px var(--accent-glow)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L7.8 4.2L11 4.8L8.6 7.2L9.2 10.5L6 8.8L2.8 10.5L3.4 7.2L1 4.8L4.2 4.2L6 1Z" fill="white" />
          </svg>
        </div>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, color: "var(--text-primary)" }}>Mockstar</span>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, position: "relative", zIndex: 1 }}>
        {["Account", "Profile", "Ready"].map((step, i) => (
          <React.Fragment key={step}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: i === 1 ? "var(--accent)" : i === 0 ? "var(--accent-soft)" : "var(--bg-subtle)",
                  border: `1.5px solid ${i === 1 ? "var(--accent)" : i === 0 ? "var(--accent)" : "var(--border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: i === 1 ? "0 0 12px var(--accent-glow)" : "none",
                }}
              >
                {i === 0 ? (
                  <svg width="14" height="14" fill="none" stroke="var(--accent)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: i === 1 ? "#FFF" : "var(--text-muted)" }}>{`0${i + 1}`}</span>
                )}
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: i === 1 ? "var(--accent)" : "var(--text-muted)", fontWeight: i === 1 ? 700 : 500 }}>
                {step}
              </span>
            </div>
            {i < 2 && <div style={{ width: 40, height: 2, background: i < 1 ? "var(--accent)" : "var(--border)", borderRadius: 2 }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Card */}
      <div
        className={shake ? "animate-shake" : ""}
        style={{
          width: "100%",
          maxWidth: 520,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 32,
          padding: "48px",
          boxShadow: "var(--shadow-lg), inset 0 0 0 1px rgba(255,255,255,0.1)",
          position: "relative",
          zIndex: 1,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginBottom: 36 }}>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 36,
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            Build Your Profile
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6, margin: "0 auto", maxWidth: "90%" }}>
            This data customizes your dashboard and helps match your mock interview questions perfectly.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {fields.map(({ id, label, placeholder, value, set, icon, disabled }) => (
            <div key={id}>
              <label
                htmlFor={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-secondary)",
                  marginBottom: 10,
                  fontWeight: 600,
                }}
              >
                <span style={{ color: "var(--accent)" }}>{icon}</span>
                {label}
              </label>
              <input
                type="text"
                id={id}
                value={value}
                onChange={e => set(e.target.value)}
                required={!disabled}
                disabled={disabled}
                placeholder={placeholder}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  background: disabled ? "var(--bg-subtle)" : "var(--bg-input)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 16,
                  color: disabled ? "var(--text-muted)" : "var(--text-primary)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  outline: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxSizing: "border-box",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                  cursor: disabled ? "not-allowed" : "text",
                }}
                onFocus={e => { if (!disabled) { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 4px var(--accent-alpha-12), inset 0 2px 4px rgba(0,0,0,0.02)"; e.target.style.background = "var(--bg-card)"; } }}
                onBlur={e => { if (!disabled) { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.02)"; e.target.style.background = "var(--bg-input)"; } }}
              />
            </div>
          ))}

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "18px",
                background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)",
                color: "#FFF",
                border: "none",
                borderRadius: 16,
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 8px 24px var(--accent-glow)",
                letterSpacing: "0.01em",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px var(--accent-glow)"; } }}
              onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px var(--accent-glow)"; } }}
            >
              {isLoading ? (
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                </span>
              ) : "Save Profile"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "16px",
                background: "transparent",
                color: "var(--text-muted)",
                border: "1.5px solid var(--border)",
                borderRadius: 16,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-subtle)"; } }}
              onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; } }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuildProfile;
