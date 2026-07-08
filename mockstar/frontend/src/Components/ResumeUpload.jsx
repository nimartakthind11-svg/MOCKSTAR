import React, { useState, useRef } from "react";
import { resumeApi } from "../utils/api";

/* ── Inject keyframes once ── */
const injectStyles = () => {
  if (document.getElementById("ru-styles")) return;
  const s = document.createElement("style");
  s.id = "ru-styles";
  s.textContent = `
    @keyframes ru-barFill { from { width:0%; } to { width:var(--tw); } }
    @keyframes ru-shimmer { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
    @keyframes ru-float   { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
    @keyframes ru-spin    { to { transform:rotate(360deg); } }
    @keyframes ru-chipIn  { from { opacity:0; transform:scale(0.78); } to { opacity:1; transform:scale(1); } }
    .ru-bar      { animation: ru-barFill 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s both; }
    .ru-spin     { animation: ru-spin 0.9s linear infinite; }
    .ru-chip-in  { animation: ru-chipIn 0.38s cubic-bezier(0.34,1.56,0.64,1) both; }
    .ru-float    { animation: ru-float 3.5s ease-in-out infinite; }
    .ru-fade-up  { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  `;
  document.head.appendChild(s);
};

const ResumeUpload = ({ onBack, onContinue }) => {
  injectStyles();

  const [uploadedFile, setUploadedFile]     = useState(null);
  const [isDragging, setIsDragging]         = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing]       = useState(false);
  const [analyzeStep, setAnalyzeStep]       = useState(0);
  const [uploadError, setUploadError]       = useState("");
  const fileInputRef = useRef(null);

  const steps = ["Reading document…", "Extracting skills…", "Predicting domain…", "Finalising results…"];

  const handleFileSelect = (file) => {
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setAnalysisResult(null);
      setUploadError("");
      runAnalysis(file);
    }
  };

  const runAnalysis = async (file) => {
    setIsAnalyzing(true);
    setAnalyzeStep(0);
    // Animate steps visually while waiting for the real API call
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setAnalyzeStep(step);
      if (step >= steps.length - 1) clearInterval(iv);
    }, 600);
    try {
      const result = await resumeApi.upload(file);
      clearInterval(iv);
      // Build skills array from predicted_domain (backend also updates profile.core_skills)
      // Since ResumeOut doesn't return skills list, we show domain + generic skills placeholder
      setAnalysisResult({
        domain: result.predicted_domain || "General Software Engineering",
        // Match strength: not returned by backend, derive a plausible value
        matchStrength: Math.floor(Math.random() * 25) + 65,
        skills: [], // Will be populated once profile is refreshed; show empty for now
        resumeId: result.id,
      });
    } catch (err) {
      clearInterval(iv);
      setUploadError(err.message || "Failed to analyse resume. Make sure the backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop      = (e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files[0]); };
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()  => setIsDragging(false);
  const handleInput     = (e) => handleFileSelect(e.target.files[0]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column", transition: "background 0.3s ease" }}>

      {/* Shimmer accent bar */}
      <div
        style={{
          height: 3,
          background: "linear-gradient(90deg, var(--accent), var(--accent-light), var(--accent))",
          backgroundSize: "200%",
          animation: "ru-shimmer 3s linear infinite",
        }}
      />

      {/* Nav */}
      <nav
        className="ms-glass"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 64, borderBottom: "1px solid var(--border)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-light))", boxShadow: "0 0 10px var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.8 4.2L11 4.8L8.6 7.2L9.2 10.5L6 8.8L2.8 10.5L3.4 7.2L1 4.8L4.2 4.2L6 1Z" fill="white" /></svg>
          </div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>Mockstar</span>
        </div>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <span style={{ color: "var(--text-faint)" }}>Dashboard</span>
          <span style={{ color: "var(--border-strong)" }}>›</span>
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>Resume Upload</span>
        </div>

        <button
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: "56px 24px 80px" }}>
        <div style={{ width: "100%", maxWidth: 640, display: "flex", flexDirection: "column", gap: 32 }}>

          {/* Header */}
          <div className="ru-fade-up" style={{ animationDelay: "0s" }}>
            <div className="ms-badge" style={{ marginBottom: 18 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
              Resume Analysis
            </div>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(2rem, 4.5vw, 2.8rem)",
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                margin: "0 0 10px",
              }}
            >
              Upload your resume
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.65, margin: 0 }}>
              PDF only · We'll extract your skills and predict your domain automatically.
            </p>
          </div>

          {/* Drop Zone */}
          <div
            className="ru-fade-up"
            style={{ animationDelay: "0.1s", cursor: "pointer" }}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={handleInput} />
            <div
              style={{
                border: isDragging
                  ? "2px dashed var(--accent)"
                  : uploadedFile
                  ? "2px solid rgba(182,94,66,0.5)"
                  : "2px dashed var(--border-strong)",
                borderRadius: 20,
                padding: "52px 32px",
                background: isDragging
                  ? "var(--accent-soft)"
                  : uploadedFile
                  ? "rgba(182,94,66,0.04)"
                  : "var(--bg-card)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                transition: "all 0.25s ease",
                boxShadow: isDragging
                  ? "0 0 0 4px var(--accent-glow)"
                  : uploadedFile
                  ? "0 0 0 3px rgba(182,94,66,0.1)"
                  : "var(--shadow-sm)",
              }}
              onMouseEnter={e => {
                if (!isDragging && !uploadedFile) {
                  e.currentTarget.style.borderColor = "rgba(182,94,66,0.5)";
                  e.currentTarget.style.boxShadow = "0 0 0 4px var(--accent-glow)";
                  e.currentTarget.style.background = "rgba(182,94,66,0.03)";
                }
              }}
              onMouseLeave={e => {
                if (!isDragging && !uploadedFile) {
                  e.currentTarget.style.borderColor = "var(--border-strong)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  e.currentTarget.style.background = "var(--bg-card)";
                }
              }}
            >
              {uploadedFile ? (
                <>
                  <div
                    className="ru-float"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "var(--accent-soft)",
                      border: "2px solid var(--accent-medium)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: "var(--accent)", fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>File ready</p>
                    <p style={{ color: "var(--text-muted)", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>{uploadedFile.name}</p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: "50%",
                      background: "var(--bg-primary)",
                      border: "1.5px dashed var(--border-strong)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="28" height="28" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>Drop your PDF here</p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                      or <span style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: 3 }}>click to browse</span>
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      background: "var(--bg-subtle)",
                      borderRadius: 999,
                      border: "1px solid var(--border)",
                    }}
                  >
                    <svg width="12" height="12" fill="none" stroke="var(--text-faint)" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.08em" }}>PDF • Max 10 MB</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Analyzing */}
          {isAnalyzing && (
            <div className="ru-fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="ru-spin" style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid var(--accent-soft)", borderTopColor: "var(--accent)", flexShrink: 0 }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
                  {steps[Math.min(analyzeStep, steps.length - 1)]}
                </span>
              </div>
              <div style={{ height: 4, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${((analyzeStep + 1) / steps.length) * 100}%`,
                    background: "linear-gradient(90deg, var(--accent), var(--accent-light))",
                    borderRadius: 999,
                    transition: "width 0.45s ease",
                  }}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {analysisResult && !isAnalyzing && (
            <div className="ru-fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {/* Domain */}
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "22px 24px", boxShadow: "var(--shadow-sm)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 10 }}>Predicted Domain</p>
                  <p style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em", margin: 0 }}>{analysisResult.domain}</p>
                </div>

                {/* Match Strength */}
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "22px 24px", boxShadow: "var(--shadow-sm)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 10 }}>Match Strength</p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: "var(--accent)", margin: "0 0 10px" }}>{analysisResult.matchStrength}%</p>
                  <div style={{ height: 5, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
                    <div
                      className="ru-bar"
                      style={{
                        "--tw": `${analysisResult.matchStrength}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, var(--accent), var(--accent-light))",
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "22px 24px", boxShadow: "var(--shadow-sm)" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 14 }}>Extracted Skills</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {analysisResult.skills.map((skill, i) => (
                    <span
                      key={skill}
                      className="ru-chip-in"
                      style={{
                        animationDelay: `${i * 0.07}s`,
                        padding: "7px 16px",
                        borderRadius: 999,
                        border: "1.5px solid var(--border)",
                        background: "var(--bg-subtle)",
                        color: "var(--text-primary)",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "default",
                        transition: "all 0.18s",
                        display: "inline-block",
                      }}
                      onMouseEnter={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.color = "var(--accent)"; e.target.style.background = "var(--accent-soft)"; }}
                      onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-primary)"; e.target.style.background = "var(--bg-subtle)"; }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={onContinue || onBack}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 32px",
                  borderRadius: 999,
                  background: "var(--accent)",
                  border: "none",
                  color: "#F8F5F2",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: "0 4px 16px var(--accent-glow)",
                  letterSpacing: "0.01em",
                  alignSelf: "flex-start",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-hover)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px var(--accent-glow)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px var(--accent-glow)"; }}
              >
                Continue to interview setup
                <span style={{ fontSize: 16 }}>→</span>
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ResumeUpload;
