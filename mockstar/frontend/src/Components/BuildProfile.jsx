import React, { useState } from "react";
import { profileApi } from "../utils/api";

const BuildProfile = ({ initialProfile, onSave, onCancel }) => {
  const [username, setUsername]       = useState(initialProfile.username || "");
  const [focusDomain, setFocusDomain] = useState(initialProfile.focusDomain || "");
  const [coreSkills, setCoreSkills]   = useState(initialProfile.coreSkills || "");
  const [shake, setShake]             = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [apiError, setApiError]       = useState("");

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
        coreSkills.trim()
      );
      onSave({
        username: updated.username,
        focusDomain: updated.focus_domain || focusDomain.trim(),
        coreSkills: updated.core_skills || coreSkills.trim(),
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
      id: "username",
      label: "Username / Full Name",
      placeholder: "e.g. Jane Smith",
      value: username,
      set: setUsername,
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
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
          <circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
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
          <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
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
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse, rgba(182,94,66,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36, position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
            boxShadow: "0 0 16px var(--accent-glow)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L7.8 4.2L11 4.8L8.6 7.2L9.2 10.5L6 8.8L2.8 10.5L3.4 7.2L1 4.8L4.2 4.2L6 1Z" fill="white" />
          </svg>
        </div>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>Mockstar</span>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, position: "relative", zIndex: 1 }}>
        {["Account", "Profile", "Ready"].map((step, i) => (
          <React.Fragment key={step}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: i === 1 ? "var(--accent)" : i === 0 ? "var(--accent-soft)" : "var(--bg-subtle)",
                  border: `1.5px solid ${i === 1 ? "var(--accent)" : i === 0 ? "var(--accent)" : "var(--border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {i === 0 ? (
                  <svg width="10" height="10" fill="none" stroke="var(--accent)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: i === 1 ? "#F8F5F2" : "var(--text-muted)" }}>{`0${i + 1}`}</span>
                )}
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: i === 1 ? "var(--accent)" : "var(--text-muted)", fontWeight: i === 1 ? 600 : 400 }}>
                {step}
              </span>
            </div>
            {i < 2 && <div style={{ width: 28, height: 1.5, background: i < 1 ? "var(--accent)" : "var(--border)" }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Card */}
      <div
        className={shake ? "animate-shake" : ""}
        style={{
          width: "100%",
          maxWidth: 460,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          padding: "36px 32px",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Card glow */}
        <div
          style={{
            position: "absolute",
            top: -30,
            left: "50%",
            transform: "translateX(-50%)",
            width: 260,
            height: 120,
            background: "radial-gradient(ellipse, rgba(182,94,66,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 28,
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 8,
              lineHeight: 1.15,
            }}
          >
            Build Your Profile
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 28 }}>
            This data customizes your dashboard and helps match your mock interview questions.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {fields.map(({ id, label, placeholder, value, set, icon }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--text-muted)",
                    marginBottom: 8,
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
                  required
                  placeholder={placeholder}
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    background: "var(--bg-input)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--text-primary)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "var(--shadow-glow)"; }}
                  onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: 14,
                  background: "var(--accent)",
                  color: "#F8F5F2",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 16px var(--accent-glow)",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px var(--accent-glow)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px var(--accent-glow)"; }}
              >
                Save Profile
              </button>
              <button
                type="button"
                onClick={onCancel}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: "transparent",
                  color: "var(--text-muted)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuildProfile;
