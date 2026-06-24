import React, { useState, useRef } from "react";

/* ── Inject keyframes once ── */
const injectStyles = () => {
  if (document.getElementById("ru-styles")) return;
  const s = document.createElement("style");
  s.id = "ru-styles";
  s.textContent = `
    @keyframes ru-fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes ru-barFill { from { width:0%; } to { width:var(--tw); } }
    @keyframes ru-spin    { to { transform:rotate(360deg); } }
    @keyframes ru-chipIn  { from { opacity:0; transform:scale(0.75); } to { opacity:1; transform:scale(1); } }
    @keyframes ru-shimmer { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
    @keyframes ru-float   { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
    .ru-fade-up  { animation: ru-fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
    .ru-bar      { animation: ru-barFill 1.1s cubic-bezier(.4,0,.2,1) 0.3s both; }
    .ru-spin     { animation: ru-spin 0.9s linear infinite; }
    .ru-chip-in  { animation: ru-chipIn 0.38s cubic-bezier(.34,1.56,.64,1) both; }
    .ru-float    { animation: ru-float 3s ease-in-out infinite; }
  `;
  document.head.appendChild(s);
};

const ResumeUpload = ({ onBack }) => {
  injectStyles();

  const [uploadedFile, setUploadedFile]     = useState(null);
  const [isDragging, setIsDragging]         = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing]       = useState(false);
  const [analyzeStep, setAnalyzeStep]       = useState(0);
  const fileInputRef = useRef(null);

  const steps = ["Reading document…", "Extracting skills…", "Predicting domain…", "Finalising results…"];

  const handleFileSelect = (file) => {
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setAnalysisResult(null);
      runAnalysis();
    }
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setAnalyzeStep(0);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setAnalyzeStep(step);
      if (step >= steps.length - 1) clearInterval(iv);
    }, 500);
    setTimeout(() => {
      clearInterval(iv);
      setIsAnalyzing(false);
      setAnalysisResult({
        domain: "Web Development",
        matchStrength: 62,
        skills: ["javascript", "react", "node.js", "css", "rest api"],
      });
    }, 2400);
  };

  const handleDrop      = (e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files[0]); };
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()  => setIsDragging(false);
  const handleInput     = (e) => handleFileSelect(e.target.files[0]);

  return (
    <div style={{ minHeight:"100vh", background:"#F4F5F2", display:"flex", flexDirection:"column" }}>

      {/* ── Subtle top accent bar ── */}
      <div style={{ height:3, background:"linear-gradient(90deg,#A6573F,#d4845f,#A6573F)", backgroundSize:"200%", animation:"ru-shimmer 3s linear infinite" }} />

      {/* ── Navbar ── */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 64px", borderBottom:"1px solid #DCDAD2", background:"#F4F5F2" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:"#A6573F", boxShadow:"0 0 0 3px rgba(166,87,63,0.15)" }} />
          <span style={{ fontFamily:"'Courier New',monospace", fontSize:"1.05rem", fontWeight:700, color:"#1C2127", letterSpacing:"0.04em" }}>
            mockstar
          </span>
        </div>
        <button
          onClick={onBack}
          style={{ fontSize:"0.82rem", color:"#5F5E5A", background:"none", border:"none", cursor:"pointer", fontWeight:500, letterSpacing:"0.02em", transition:"color 0.2s" }}
          onMouseEnter={e => e.target.style.color = "#A6573F"}
          onMouseLeave={e => e.target.style.color = "#5F5E5A"}
        >
          ← Back to Dashboard
        </button>
      </nav>

      {/* ── Main ── */}
      <main style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"flex-start", padding:"56px 24px" }}>
        <div style={{ width:"100%", maxWidth:620, display:"flex", flexDirection:"column", gap:36 }}>

          {/* ── Hero heading ── */}
          <div className="ru-fade-up" style={{ animationDelay:"0s" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(166,87,63,0.08)", border:"1px solid rgba(166,87,63,0.2)", borderRadius:99, padding:"4px 14px", marginBottom:14 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#A6573F" }} />
              <span style={{ fontSize:"0.7rem", color:"#A6573F", fontFamily:"'Courier New',monospace", letterSpacing:"0.14em", textTransform:"uppercase", fontWeight:600 }}>
                Resume Analysis
              </span>
            </div>
            <h1 style={{ fontSize:"clamp(2rem,4.5vw,2.8rem)", fontWeight:800, color:"#1C2127", lineHeight:1.1, letterSpacing:"-0.02em", margin:0 }}>
              Upload your resume
            </h1>
            <p style={{ marginTop:10, color:"#5F5E5A", fontSize:"0.9rem", lineHeight:1.6 }}>
              PDF only · We'll extract your skills and predict your domain
            </p>
          </div>

          {/* ── Drop Zone ── */}
          <div
            className="ru-fade-up"
            style={{ animationDelay:"0.1s" }}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div style={{
              border: isDragging ? "2px dashed #A6573F" : uploadedFile ? "2px solid rgba(166,87,63,0.5)" : "2px dashed #DCDAD2",
              borderRadius:18,
              padding:"52px 32px",
              background: isDragging ? "rgba(166,87,63,0.04)" : uploadedFile ? "rgba(166,87,63,0.03)" : "#fff",
              cursor:"pointer",
              transition:"all 0.25s ease",
              display:"flex", flexDirection:"column", alignItems:"center", gap:14,
              boxShadow: isDragging ? "0 0 0 4px rgba(166,87,63,0.12)" : uploadedFile ? "0 0 0 3px rgba(166,87,63,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={e => {
              if (!isDragging && !uploadedFile) {
                e.currentTarget.style.border = "2px dashed rgba(166,87,63,0.5)";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(166,87,63,0.08)";
                e.currentTarget.style.background = "rgba(166,87,63,0.025)";
              }
            }}
            onMouseLeave={e => {
              if (!isDragging && !uploadedFile) {
                e.currentTarget.style.border = "2px dashed #DCDAD2";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                e.currentTarget.style.background = "#fff";
              }
            }}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={handleInput} />

              {uploadedFile ? (
                <>
                  <div className="ru-float" style={{ width:56, height:56, borderRadius:"50%", background:"rgba(166,87,63,0.1)", border:"1.5px solid rgba(166,87,63,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A6573F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <p style={{ color:"#A6573F", fontWeight:700, fontSize:"0.88rem" }}>File ready</p>
                    <p style={{ color:"#5F5E5A", fontSize:"0.78rem", fontFamily:"'Courier New',monospace", marginTop:4 }}>{uploadedFile.name}</p>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ width:64, height:64, borderRadius:"50%", background:"#F4F5F2", border:"1.5px dashed #DCDAD2", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#BDBBB3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <p style={{ color:"#1C2127", fontWeight:600, fontSize:"0.92rem" }}>Drop your PDF here</p>
                    <p style={{ color:"#9B9894", fontSize:"0.8rem", marginTop:4 }}>
                      or <span style={{ color:"#A6573F", textDecoration:"underline", textUnderlineOffset:2 }}>click to browse</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Analyzing ── */}
          {isAnalyzing && (
            <div className="ru-fade-up" style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div className="ru-spin" style={{ width:15, height:15, borderRadius:"50%", border:"2px solid rgba(166,87,63,0.25)", borderTopColor:"#A6573F", flexShrink:0 }} />
                <span style={{ color:"#5F5E5A", fontSize:"0.82rem", fontFamily:"'Courier New',monospace" }}>
                  {steps[Math.min(analyzeStep, steps.length - 1)]}
                </span>
              </div>
              <div style={{ height:3, background:"#DCDAD2", borderRadius:99, overflow:"hidden" }}>
                <div style={{
                  height:"100%",
                  width:`${((analyzeStep + 1) / steps.length) * 100}%`,
                  background:"linear-gradient(90deg,#A6573F,#d4845f)",
                  borderRadius:99,
                  transition:"width 0.45s ease"
                }} />
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {analysisResult && !isAnalyzing && (
            <div className="ru-fade-up" style={{ animationDelay:"0s", display:"flex", flexDirection:"column", gap:0 }}>

              {/* Stat cards row */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>

                {/* Domain card */}
                <div style={{ background:"#fff", border:"1px solid #DCDAD2", borderRadius:16, padding:"22px 24px", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
                  <p style={{ fontSize:"0.62rem", letterSpacing:"0.16em", color:"#9B9894", textTransform:"uppercase", fontFamily:"'Courier New',monospace", marginBottom:8 }}>
                    Predicted Domain
                  </p>
                  <p style={{ fontSize:"1.25rem", fontWeight:800, color:"#1C2127", letterSpacing:"-0.01em" }}>
                    {analysisResult.domain}
                  </p>
                </div>

                {/* Match Strength card */}
                <div style={{ background:"#fff", border:"1px solid #DCDAD2", borderRadius:16, padding:"22px 24px", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
                  <p style={{ fontSize:"0.62rem", letterSpacing:"0.16em", color:"#9B9894", textTransform:"uppercase", fontFamily:"'Courier New',monospace", marginBottom:8 }}>
                    Match Strength
                  </p>
                  <p style={{ fontSize:"1.25rem", fontWeight:800, color:"#A6573F" }}>
                    {analysisResult.matchStrength}%
                  </p>
                  <div style={{ height:4, background:"#F0EEE8", borderRadius:99, overflow:"hidden", marginTop:10 }}>
                    <div
                      className="ru-bar"
                      style={{
                        "--tw": `${analysisResult.matchStrength}%`,
                        height:"100%",
                        background:"linear-gradient(90deg,#A6573F,#d4845f)",
                        borderRadius:99,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Skills card */}
              <div style={{ background:"#fff", border:"1px solid #DCDAD2", borderRadius:16, padding:"22px 24px", boxShadow:"0 1px 6px rgba(0,0,0,0.05)", marginBottom:14 }}>
                <p style={{ fontSize:"0.62rem", letterSpacing:"0.16em", color:"#9B9894", textTransform:"uppercase", fontFamily:"'Courier New',monospace", marginBottom:14 }}>
                  Extracted Skills
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {analysisResult.skills.map((skill, i) => (
                    <span
                      key={skill}
                      className="ru-chip-in"
                      style={{
                        animationDelay:`${i * 0.07}s`,
                        padding:"6px 16px",
                        borderRadius:99,
                        border:"1.5px solid #DCDAD2",
                        background:"#F4F5F2",
                        color:"#1C2127",
                        fontSize:"0.8rem",
                        fontFamily:"'Courier New',monospace",
                        fontWeight:500,
                        cursor:"default",
                        transition:"all 0.18s",
                        display:"inline-block",
                      }}
                      onMouseEnter={e => { e.target.style.borderColor="#A6573F"; e.target.style.color="#A6573F"; e.target.style.background="rgba(166,87,63,0.06)"; }}
                      onMouseLeave={e => { e.target.style.borderColor="#DCDAD2"; e.target.style.color="#1C2127"; e.target.style.background="#F4F5F2"; }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={onBack}
                style={{
                  alignSelf:"flex-start",
                  padding:"14px 32px",
                  borderRadius:12,
                  background:"#1C2127",
                  border:"none",
                  color:"#F4F5F2",
                  fontWeight:700,
                  fontSize:"0.9rem",
                  letterSpacing:"0.02em",
                  cursor:"pointer",
                  transition:"all 0.2s",
                  boxShadow:"0 4px 16px rgba(28,33,39,0.2)",
                }}
                onMouseEnter={e => { e.target.style.background="#A6573F"; e.target.style.boxShadow="0 6px 22px rgba(166,87,63,0.35)"; e.target.style.transform="translateY(-1px)"; }}
                onMouseLeave={e => { e.target.style.background="#1C2127"; e.target.style.boxShadow="0 4px 16px rgba(28,33,39,0.2)"; e.target.style.transform="translateY(0)"; }}
              >
                Continue to interview setup →
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ResumeUpload;
