import React, { useState } from "react";

const injectStyles = () => {
  if (document.getElementById("is-styles")) return;
  const s = document.createElement("style");
  s.id = "is-styles";
  s.textContent = `
    @keyframes is-shimmer { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
    @keyframes is-fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
    .is-fade-up { animation: is-fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  `;
  document.head.appendChild(s);
};

const v = (n) => `var(${n})`;

/* ── Option Card ── */
const OptionCard = ({ label, sublabel, icon, selected, onClick, delay = "0s" }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="is-fade-up"
      style={{
        animationDelay: delay,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 6,
        padding: "18px 20px",
        borderRadius: 16,
        border: selected ? `2px solid ${v("--accent")}` : `1.5px solid ${hovered ? "rgba(182,94,66,0.4)" : v("--border")}`,
        background: selected ? v("--accent-soft") : hovered ? "var(--bg-card-hover)" : v("--bg-card"),
        boxShadow: selected ? "0 0 0 3px var(--accent-glow)" : "var(--shadow-xs)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
        <span style={{ fontSize: "1.1rem" }}>{icon}</span>
        <span style={{ fontWeight: 600, color: selected ? v("--accent") : v("--text-primary"), fontSize: "0.9rem", flex: 1, transition: "color 0.2s" }}>{label}</span>
        {selected && (
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: v("--accent"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
      {sublabel && <span style={{ fontSize: "0.73rem", color: v("--text-muted"), lineHeight: 1.4 }}>{sublabel}</span>}
    </button>
  );
};

/* ── Section label with number badge ── */
const SectionLabel = ({ number, label, delay = "0s" }) => (
  <div className="is-fade-up" style={{ animationDelay: delay, display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 8px var(--accent-glow)",
      }}
    >
      <span style={{ color: "#F8F5F2", fontSize: "0.68rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{number}</span>
    </div>
    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: v("--text-primary"), letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
  </div>
);

/* ── Preview row ── */
const PreviewRow = ({ label, value, valueColor }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: v("--text-muted"), textTransform: "uppercase", letterSpacing: "0.09em", margin: 0 }}>{label}</p>
    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: valueColor || v("--text-primary"), margin: 0 }}>{value}</p>
  </div>
);

const InterviewSetup = ({ onBack, onStart, startError }) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async (config) => {
    setIsStarting(true);
    try {
      await onStart(config);
    } finally {
      setIsStarting(false);
    }
  };

  injectStyles();
  const [interviewType, setInterviewType] = useState("technical");
  const [difficulty, setDifficulty]       = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [focusAreas, setFocusAreas]       = useState([]);
  const [customRole, setCustomRole]       = useState("");

  const allFocusAreas = ["Data Structures","System Design","Algorithms","React / Frontend","Node.js / Backend","REST APIs","Databases","Leadership","Problem Solving","Communication"];
  const toggleFocus = (area) => setFocusAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  const canStart = interviewType && difficulty && questionCount;

  const diffColor = difficulty === "easy" ? "#3a8f5e" : difficulty === "medium" ? "#C17D2B" : "#B84040";

  return (
    <div style={{ minHeight: "100vh", background: v("--bg-primary"), display: "flex", flexDirection: "column", transition: "background 0.3s" }}>

      {/* Shimmer accent bar */}
      <div style={{ height: 3, background: "linear-gradient(90deg, var(--accent), var(--accent-light), var(--accent))", backgroundSize: "200%", animation: "is-shimmer 3s linear infinite" }} />

      {/* Nav */}
      <nav
        className="ms-glass"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 64, borderBottom: `1px solid ${v("--border")}` }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-light))", boxShadow: "0 0 10px var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.8 4.2L11 4.8L8.6 7.2L9.2 10.5L6 8.8L2.8 10.5L3.4 7.2L1 4.8L4.2 4.2L6 1Z" fill="white" /></svg>
          </div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: v("--text-primary") }}>Mockstar</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: v("--text-muted") }}>
          <span
            onClick={onBack}
            style={{ cursor: "pointer", transition: "color 0.2s", color: v("--text-faint") }}
            onMouseEnter={e => e.target.style.color = "var(--accent)"}
            onMouseLeave={e => e.target.style.color = "var(--text-faint)"}
          >
            Resume Upload
          </span>
          <span style={{ color: v("--border-strong") }}>›</span>
          <span style={{ color: v("--accent"), fontWeight: 600 }}>Interview Setup</span>
        </div>

        <button
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: v("--text-muted"), background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: "48px 24px 80px" }}>
        <div style={{ width: "100%", maxWidth: 960, display: "flex", gap: 28, alignItems: "flex-start" }}>

          {/* LEFT: Form */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 36 }}>

            {/* Hero */}
            <div className="is-fade-up" style={{ animationDelay: "0s" }}>
              <div className="ms-badge" style={{ marginBottom: 16 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: v("--accent"), display: "inline-block" }} />
                Interview Setup
              </div>
              <h1
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(1.9rem, 4vw, 2.7rem)",
                  fontWeight: 600,
                  color: v("--text-primary"),
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  margin: "0 0 10px",
                }}
              >
                Configure your<br />mock interview
              </h1>
              <p style={{ color: v("--text-muted"), fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>Tailor the session to your goals. Every setting matters.</p>
            </div>

            {/* Type */}
            <div>
              <SectionLabel number="01" label="Interview Type" delay="0.08s" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <OptionCard delay="0.1s" label="Technical" sublabel="DSA, system design, code" selected={interviewType === "technical"} onClick={() => setInterviewType("technical")} />
                <OptionCard delay="0.13s" label="Behavioral" sublabel="Soft skills & leadership" selected={interviewType === "behavioral"} onClick={() => setInterviewType("behavioral")} />
                <OptionCard delay="0.16s" label="Mixed" sublabel="Best of both worlds" selected={interviewType === "mixed"} onClick={() => setInterviewType("mixed")} />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <SectionLabel number="02" label="Difficulty Level" delay="0.18s" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <OptionCard delay="0.2s" label="Easy" sublabel="Entry level, fundamentals" selected={difficulty === "easy"} onClick={() => setDifficulty("easy")} />
                <OptionCard delay="0.23s" label="Medium" sublabel="Mid-level, common patterns" selected={difficulty === "medium"} onClick={() => setDifficulty("medium")} />
                <OptionCard delay="0.26s" label="Hard" sublabel="Senior level, edge cases" selected={difficulty === "hard"} onClick={() => setDifficulty("hard")} />
              </div>
            </div>

            {/* Questions */}
            <div>
              <SectionLabel number="03" label="Number of Questions" delay="0.28s" />
              <div className="is-fade-up" style={{ animationDelay: "0.3s", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                {[3, 5, 8, 10].map(n => {
                  const active = questionCount === n;
                  return (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      style={{
                        padding: "10px 22px",
                        borderRadius: 12,
                        border: active ? `2px solid ${v("--accent")}` : `1.5px solid ${v("--border")}`,
                        background: active ? v("--accent-soft") : v("--bg-card"),
                        color: active ? v("--accent") : v("--text-primary"),
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        transition: "all 0.18s",
                        boxShadow: active ? "0 0 0 3px var(--accent-glow)" : v("--shadow-xs"),
                      }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = "rgba(182,94,66,0.4)"; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "var(--border)"; } }}
                    >
                      {n}
                    </button>
                  );
                })}
                <span style={{ fontSize: "0.8rem", color: v("--text-muted"), marginLeft: 4, fontFamily: "'JetBrains Mono', monospace" }}>questions</span>
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <SectionLabel number="04" label="Focus Areas (optional)" delay="0.32s" />
              <div className="is-fade-up" style={{ animationDelay: "0.34s", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {allFocusAreas.map(area => {
                  const active = focusAreas.includes(area);
                  return (
                    <button
                      key={area}
                      onClick={() => toggleFocus(area)}
                      style={{
                        padding: "7px 16px",
                        borderRadius: 999,
                        border: active ? `1.5px solid ${v("--accent")}` : `1.5px solid ${v("--border")}`,
                        background: active ? v("--accent-soft") : v("--bg-card"),
                        color: active ? v("--accent") : v("--text-muted"),
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.78rem",
                        fontWeight: active ? 600 : 500,
                        cursor: "pointer",
                        transition: "all 0.18s",
                        boxShadow: active ? "0 0 0 2px var(--accent-glow)" : "none",
                      }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = "rgba(182,94,66,0.4)"; e.currentTarget.style.color = "var(--accent)"; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; } }}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Role */}
            <div>
              <SectionLabel number="05" label="Target Role (optional)" delay="0.36s" />
              <div className="is-fade-up" style={{ animationDelay: "0.38s" }}>
                <input
                  type="text"
                  placeholder="e.g. Frontend Engineer at Google"
                  value={customRole}
                  onChange={e => setCustomRole(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "13px 18px",
                    borderRadius: 14,
                    border: `1.5px solid ${v("--border")}`,
                    background: v("--bg-card"),
                    color: v("--text-primary"),
                    fontSize: "0.88rem",
                    fontFamily: "'Inter', sans-serif",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "var(--shadow-glow)"; }}
                  onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Preview card */}
          <div style={{ width: 288, flexShrink: 0, position: "sticky", top: 88 }}>
            <div
              className="is-fade-up"
              style={{
                animationDelay: "0.1s",
                background: v("--bg-card"),
                border: `1px solid ${v("--border")}`,
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: v("--shadow-md"),
              }}
            >
              {/* Preview header */}
              <div style={{ padding: "18px 22px", borderBottom: `1px solid ${v("--border")}`, background: v("--bg-subtle") }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", color: v("--text-muted"), textTransform: "uppercase", marginBottom: 5 }}>Session Preview</p>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: v("--text-primary"), fontFamily: "'Fraunces', serif", letterSpacing: "-0.01em", margin: 0 }}>{customRole || "Mock Interview"}</p>
              </div>

              {/* Preview rows */}
              <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
                <PreviewRow label="Type" value={interviewType ? interviewType.charAt(0).toUpperCase() + interviewType.slice(1) : "—"} />
                <PreviewRow label="Difficulty" value={difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "—"} valueColor={diffColor} />
                <PreviewRow label="Questions" value={`${questionCount} questions`} />
                <PreviewRow label="Est. Time" value={`~${questionCount * 4} min`} />

                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: v("--text-muted"), textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Focus Areas</p>
                  {focusAreas.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {focusAreas.map(a => (
                        <span
                          key={a}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 999,
                            background: v("--accent-soft"),
                            border: "1px solid var(--accent-medium)",
                            fontSize: "0.68rem",
                            color: v("--accent"),
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "0.75rem", color: v("--text-faint"), fontStyle: "italic", margin: 0 }}>None selected</p>
                  )}
                </div>

                <div style={{ height: 1, background: v("--border") }} />

                {startError && (
                  <div
                    role="alert"
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "#D33F3F14",
                      border: "1px solid #D33F3F44",
                      color: "#D33F3F",
                      fontSize: "0.8rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {startError}
                  </div>
                )}

                <button
                  onClick={() => canStart && !isStarting && handleStart({ interviewType, difficulty, questionCount, focusAreas, customRole })}
                  disabled={!canStart || isStarting}
                  style={{
                    padding: "13px",
                    borderRadius: 12,
                    border: "none",
                    background: canStart && !isStarting ? v("--accent") : v("--border"),
                    color: canStart && !isStarting ? "#F8F5F2" : v("--text-muted"),
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    cursor: canStart && !isStarting ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease",
                    width: "100%",
                    letterSpacing: "0.02em",
                    boxShadow: canStart && !isStarting ? "0 4px 16px var(--accent-glow)" : "none",
                  }}
                  onMouseEnter={e => { if (canStart && !isStarting) { e.currentTarget.style.background = "var(--accent-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px var(--accent-glow)"; } }}
                  onMouseLeave={e => { if (canStart && !isStarting) { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px var(--accent-glow)"; } }}
                >
                  {isStarting ? "Starting…" : "Start Interview →"}
                </button>
              </div>
            </div>

            {/* Tips */}
            <div
              className="is-fade-up"
              style={{
                animationDelay: "0.2s",
                marginTop: 14,
                background: v("--accent-soft"),
                border: `1px solid ${v("--accent-medium")}`,
                borderRadius: 16,
                padding: "16px 18px",
              }}
            >
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: v("--accent"), textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>💡 Tips</p>
              {["Start with Medium to gauge your baseline.", "Pick focus areas matching your job description.", "5–8 questions is the sweet spot for a full session."].map((tip, i) => (
                <p key={i} style={{ fontSize: "0.75rem", color: v("--text-muted"), lineHeight: 1.55, margin: i < 2 ? "0 0 8px" : 0 }}>· {tip}</p>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewSetup;
