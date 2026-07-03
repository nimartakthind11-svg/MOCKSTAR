import React, { useState } from "react";

const BuildProfile = ({ initialProfile, onSave, onCancel }) => {
  const [username, setUsername] = useState(initialProfile.username || "");
  const [focusDomain, setFocusDomain] = useState(initialProfile.focusDomain || "");
  const [coreSkills, setCoreSkills] = useState(initialProfile.coreSkills || "");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !focusDomain.trim() || !coreSkills.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onSave({
      username: username.trim(),
      focusDomain: focusDomain.trim(),
      coreSkills: coreSkills.trim(),
      isBuilt: true,
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "var(--bg-primary)",
    border: "1.5px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    marginBottom: 6,
    fontWeight: 500,
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6 animate-fadeIn transition-colors duration-300"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Brand header */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-3 h-3 rounded-full" style={{ background: "var(--accent)" }} />
        <span className="font-mono text-xl tracking-wide font-semibold" style={{ color: "var(--text-primary)" }}>
          Mockstar by Mocktane
        </span>
      </div>

      {/* Card */}
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl p-8 transition-all duration-300 ${shake ? "animate-shake" : ""}`}
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-3xl font-serif mb-2 font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
          Build Your Profile
        </h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Set up your profile information. This data will be used to customize your dashboard metrics and match your mock interview questions.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {[
            { id: "username",    label: "Username / Full Name",                value: username,    set: setUsername },
            { id: "focusDomain", label: "Focus Domain (e.g. Frontend Development)", value: focusDomain, set: setFocusDomain },
            { id: "coreSkills",  label: "Core Skills (e.g. React, CSS, JavaScript)", value: coreSkills,  set: setCoreSkills },
          ].map(({ id, label, value, set }) => (
            <div key={id}>
              <label htmlFor={id} style={labelStyle}>{label}</label>
              <input
                type="text" id={id} value={value}
                onChange={e => set(e.target.value)} required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
          ))}

          <div className="flex flex-col gap-3 mt-4">
            <button
              type="submit"
              className="w-full py-3.5 rounded-lg font-semibold active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer text-sm"
              style={{ background: "var(--accent)", color: "#F4F5F2" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--accent-hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
            >
              Save Profile
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-3.5 rounded-lg font-semibold active:scale-[0.98] transition-all duration-200 cursor-pointer text-sm"
              style={{
                background: "var(--bg-primary)",
                border: "1.5px solid var(--border)",
                color: "var(--text-muted)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--text-primary)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
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
