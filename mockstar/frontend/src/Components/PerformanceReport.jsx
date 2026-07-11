import React, { useEffect } from "react";

const injectStyles = () => {
  if (document.getElementById("pr-styles")) return;
  const s = document.createElement("style");
  s.id = "pr-styles";
  s.textContent = `
    @keyframes pr-fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pr-ringFill { from { stroke-dashoffset:283; } to { stroke-dashoffset:var(--offset); } }
    .pr-fade-up { animation: pr-fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .pr-ring { animation: pr-ringFill 1.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both; }
  `;
  document.head.appendChild(s);
};

const v = (n) => `var(${n})`;

const PerformanceReport = ({ report, onBackToDash, onRetry }) => {
  injectStyles();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!report) return null;

  const score = report.score || 0;
  const scoreColor = score >= 80 ? "#3a8f5e" : score >= 60 ? "#C17D2B" : "#B84040";
  const integrity = report.integrity ?? 100;
  const integrityColor = integrity >= 90 ? "#3a8f5e" : integrity >= 70 ? "#C17D2B" : "#B84040";
  const integrityDetail = report.integrityDetail ?? { tabSwitchCount: 0, pasteCount: 0 };
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ minHeight: "100vh", background: v("--bg-primary"), display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav className="ms-glass no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 64, borderBottom: `1px solid ${v("--border")}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-light))", boxShadow: "0 0 10px var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.8 4.2L11 4.8L8.6 7.2L9.2 10.5L6 8.8L2.8 10.5L3.4 7.2L1 4.8L4.2 4.2L6 1Z" fill="white" /></svg>
          </div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: v("--text-primary") }}>Mockstar</span>
        </div>
        <button
          onClick={onBackToDash}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: v("--text-muted"), background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = v("--accent")}
          onMouseLeave={e => e.currentTarget.style.color = v("--text-muted")}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Dashboard
        </button>
      </nav>

      <main style={{ flex: 1, padding: "48px 24px 80px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 860, display: "flex", flexDirection: "column", gap: 32 }}>

          {/* Header Row */}
          <div className="pr-fade-up" style={{ animationDelay: "0s", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div className="ms-badge" style={{ marginBottom: 16 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: v("--accent"), display: "inline-block" }} />
                Session Report
              </div>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: v("--text-primary"), margin: "0 0 10px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Interview Results
              </h1>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: v("--text-muted"), margin: 0 }}>
                {report.date} · {report.role}
              </p>
            </div>

            {/* Actions */}
            <div className="no-print" style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => window.print()}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                  background: "transparent", color: v("--text-primary"), border: `1.5px solid ${v("--border-strong")}`, borderRadius: 999,
                  fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = v("--accent"); e.currentTarget.style.color = v("--accent"); }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = v("--border-strong"); e.currentTarget.style.color = v("--text-primary"); }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print Report
              </button>
              <button
                onClick={onRetry}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 24px",
                  background: v("--accent"), color: "#F8F5F2", border: "none", borderRadius: 999,
                  fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                  boxShadow: "0 4px 16px var(--accent-glow)"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = v("--accent-hover"); e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = v("--accent"); e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>
                Try Again
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>

            {/* Score Card */}
            <div className="pr-fade-up print-clean" style={{ animationDelay: "0.1s", background: v("--bg-card"), border: `1px solid ${v("--border")}`, borderRadius: 24, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: v("--shadow-sm") }}>
              <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="140" height="140" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r={radius} fill="none" stroke={v("--border")} strokeWidth="6" />
                  <circle
                    className="pr-ring"
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    style={{ "--offset": offset, strokeLinecap: "round" }}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: "2.8rem", fontWeight: 600, color: scoreColor, lineHeight: 1 }}>{score}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: v("--text-muted"), textTransform: "uppercase", letterSpacing: "0.1em" }}>Score</span>
                </div>
              </div>
              <p style={{ marginTop: 24, fontSize: "1rem", fontWeight: 600, color: v("--text-primary"), textAlign: "center" }}>
                {score >= 80 ? "Excellent performance!" : score >= 60 ? "Good effort, keep practicing." : "Needs improvement."}
              </p>
            </div>

            {/* Details Card */}
            <div className="pr-fade-up print-clean" style={{ animationDelay: "0.15s", background: v("--bg-card"), border: `1px solid ${v("--border")}`, borderRadius: 24, padding: 32, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24, boxShadow: v("--shadow-sm") }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: v("--text-muted"), textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Interview Type</p>
                <p style={{ fontSize: "1.1rem", fontWeight: 600, color: v("--text-primary"), margin: 0, textTransform: "capitalize" }}>{report.type}</p>
              </div>
              <div style={{ height: 1, background: v("--border") }} />
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: v("--text-muted"), textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Difficulty</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: v("--accent-soft"), borderRadius: 999 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: v("--accent") }} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: v("--accent"), textTransform: "capitalize" }}>{report.difficulty}</span>
                </div>
              </div>
              <div style={{ height: 1, background: v("--border") }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: v("--text-muted"), textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Questions</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600, color: v("--text-primary"), margin: 0 }}>{report.questionsCount}</p>
                </div>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: v("--text-muted"), textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Integrity</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600, color: integrityColor, margin: 0 }}>{integrity}%</p>
                  {(integrityDetail.tabSwitchCount > 0 || integrityDetail.pasteCount > 0) && (
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: v("--text-faint"), margin: "4px 0 0" }}>
                      {integrityDetail.tabSwitchCount > 0 && `${integrityDetail.tabSwitchCount} tab switch${integrityDetail.tabSwitchCount === 1 ? "" : "es"}`}
                      {integrityDetail.tabSwitchCount > 0 && integrityDetail.pasteCount > 0 && " · "}
                      {integrityDetail.pasteCount > 0 && `${integrityDetail.pasteCount} paste${integrityDetail.pasteCount === 1 ? "" : "s"}`}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Transcript List */}
          <div className="pr-fade-up" style={{ animationDelay: "0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 600, color: v("--text-primary"), margin: 0, letterSpacing: "-0.01em" }}>Full Transcript</h2>
              <div style={{ flex: 1, height: 1, background: v("--border") }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {report.transcript && report.transcript.filter(m => m.role === "candidate").map((msg, i) => {
                const questionMsg = report.transcript[report.transcript.indexOf(msg) - 1];
                return (
                  <div key={i} className="print-clean" style={{ background: v("--bg-card"), border: `1px solid ${v("--border")}`, borderRadius: 20, padding: 28, boxShadow: v("--shadow-xs") }}>
                    {/* Q */}
                    <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-light))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Q</div>
                      <div>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: v("--text-muted"), margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Interviewer</p>
                        <p style={{ fontSize: "1rem", color: v("--text-primary"), margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{questionMsg?.text}</p>
                      </div>
                    </div>
                    <div style={{ marginLeft: 16, borderLeft: `2px solid ${v("--border")}`, paddingLeft: 24 }}>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: v("--accent"), margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Your Answer</p>
                      <p style={{ fontSize: "0.95rem", color: v("--text-muted"), margin: 0, lineHeight: 1.6 }}>{msg.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PerformanceReport;
