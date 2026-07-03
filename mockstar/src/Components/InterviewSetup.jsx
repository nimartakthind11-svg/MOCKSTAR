import React, { useState } from "react";

const injectStyles = () => {
  if (document.getElementById("is-styles")) return;
  const s = document.createElement("style");
  s.id = "is-styles";
  s.textContent = `
    @keyframes is-fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
    @keyframes is-shimmer { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
    .is-fade-up { animation: is-fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
  `;
  document.head.appendChild(s);
};

const v = (n) => `var(${n})`;

const OptionCard = ({ label, sublabel, icon, selected, onClick, delay = "0s" }) => (
  <button
    onClick={onClick}
    className="is-fade-up"
    style={{
      animationDelay: delay,
      display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6,
      padding: "18px 20px", borderRadius: 14,
      border: selected ? `2px solid ${v("--accent")}` : `1.5px solid ${v("--border")}`,
      background: selected ? "rgba(166,87,63,0.07)" : v("--bg-card"),
      boxShadow: selected ? "0 0 0 3px rgba(166,87,63,0.1)" : v("--shadow-card"),
      cursor: "pointer", transition: "all 0.2s ease", textAlign: "left", width: "100%",
    }}
    onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = "rgba(166,87,63,0.4)"; } }}
    onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = "var(--border)"; } }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
      <span style={{ fontSize: "1.15rem" }}>{icon}</span>
      <span style={{ fontWeight: 700, color: v("--text-primary"), fontSize: "0.9rem" }}>{label}</span>
      {selected && (
        <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", background: v("--accent"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
    {sublabel && <span style={{ fontSize: "0.75rem", color: v("--text-muted"), lineHeight: 1.4 }}>{sublabel}</span>}
  </button>
);

const SectionLabel = ({ number, label, delay = "0s" }) => (
  <div className="is-fade-up" style={{ animationDelay: delay, display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
    <div style={{ width: 26, height: 26, borderRadius: "50%", background: v("--text-primary"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ color: v("--bg-primary"), fontSize: "0.7rem", fontWeight: 700, fontFamily: "'Courier New',monospace" }}>{number}</span>
    </div>
    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: v("--text-primary"), letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Courier New',monospace" }}>{label}</span>
  </div>
);

const PreviewRow = ({ label, value, valueColor }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <p style={{ fontSize: "0.73rem", color: v("--text-muted"), textTransform: "uppercase", letterSpacing: "0.09em", fontFamily: "'Courier New',monospace" }}>{label}</p>
    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: valueColor || v("--text-primary") }}>{value}</p>
  </div>
);

const InterviewSetup = ({ onBack, onStart }) => {
  injectStyles();
  const [interviewType, setInterviewType] = useState("technical");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [focusAreas, setFocusAreas] = useState([]);
  const [customRole, setCustomRole] = useState("");

  const allFocusAreas = ["Data Structures","System Design","Algorithms","React / Frontend","Node.js / Backend","REST APIs","Databases","Leadership","Problem Solving","Communication"];
  const toggleFocus = (area) => setFocusAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  const canStart = interviewType && difficulty && questionCount;

  return (
    <div style={{ minHeight:"100vh", background:v("--bg-primary"), display:"flex", flexDirection:"column", transition:"background 0.25s" }}>

      {/* Accent bar */}
      <div style={{ height:3, background:`linear-gradient(90deg,${v("--accent")},#d4845f,${v("--accent")})`, backgroundSize:"200%", animation:"is-shimmer 3s linear infinite" }} />

      {/* Navbar */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 64px", borderBottom:`1px solid ${v("--border")}`, background:v("--bg-nav") }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:v("--accent"), boxShadow:"0 0 0 3px rgba(166,87,63,0.15)" }} />
          <span style={{ fontFamily:"'Courier New',monospace", fontSize:"1.05rem", fontWeight:700, color:v("--text-primary"), letterSpacing:"0.04em" }}>mockstar</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.78rem", color:v("--text-muted") }}>
            <span onClick={onBack} style={{ cursor:"pointer", transition:"color 0.2s" }}
              onMouseEnter={e => e.target.style.color="var(--accent)"}
              onMouseLeave={e => e.target.style.color="var(--text-muted)"}
            >Resume Upload</span>
            <span>›</span>
            <span style={{ color:v("--text-primary"), fontWeight:600 }}>Interview Setup</span>
          </div>
          <button onClick={onBack}
            style={{ fontSize:"0.82rem", color:v("--text-muted"), background:"none", border:"none", cursor:"pointer", fontWeight:500, transition:"color 0.2s" }}
            onMouseEnter={e => e.target.style.color="var(--accent)"}
            onMouseLeave={e => e.target.style.color="var(--text-muted)"}
          >← Back</button>
        </div>
      </nav>

      {/* Main */}
      <main style={{ flex:1, display:"flex", justifyContent:"center", padding:"52px 24px 80px" }}>
        <div style={{ width:"100%", maxWidth:920, display:"flex", gap:28, alignItems:"flex-start" }}>

          {/* Left: Form */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:36 }}>

            {/* Hero */}
            <div className="is-fade-up" style={{ animationDelay:"0s" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(166,87,63,0.08)", border:"1px solid rgba(166,87,63,0.2)", borderRadius:99, padding:"4px 14px", marginBottom:14 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:v("--accent") }} />
                <span style={{ fontSize:"0.7rem", color:v("--accent"), fontFamily:"'Courier New',monospace", letterSpacing:"0.14em", textTransform:"uppercase", fontWeight:600 }}>Interview Setup</span>
              </div>
              <h1 style={{ fontSize:"clamp(1.9rem,4vw,2.6rem)", fontWeight:800, color:v("--text-primary"), lineHeight:1.1, letterSpacing:"-0.02em", margin:0 }}>
                Configure your<br />mock interview
              </h1>
              <p style={{ marginTop:10, color:v("--text-muted"), fontSize:"0.88rem", lineHeight:1.6 }}>Tailor the session to your goals. Every setting matters.</p>
            </div>

            {/* Section 1: Type */}
            <div>
              <SectionLabel number="01" label="Interview Type" delay="0.08s" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                <OptionCard delay="0.1s" label="Technical" sublabel="DSA, system design, code" selected={interviewType==="technical"} onClick={() => setInterviewType("technical")} />
                <OptionCard delay="0.13s" label="Behavioral" sublabel="Soft skills & leadership" selected={interviewType==="behavioral"} onClick={() => setInterviewType("behavioral")} />
                <OptionCard delay="0.16s" label="Mixed" sublabel="Best of both worlds" selected={interviewType==="mixed"} onClick={() => setInterviewType("mixed")} />
              </div>
            </div>

            {/* Section 2: Difficulty */}
            <div>
              <SectionLabel number="02" label="Difficulty Level" delay="0.18s" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                <OptionCard delay="0.2s" label="Easy" sublabel="Entry level, fundamentals" selected={difficulty==="easy"} onClick={() => setDifficulty("easy")} />
                <OptionCard delay="0.23s" label="Medium" sublabel="Mid-level, common patterns" selected={difficulty==="medium"} onClick={() => setDifficulty("medium")} />
                <OptionCard delay="0.26s" label="Hard" sublabel="Senior level, edge cases" selected={difficulty==="hard"} onClick={() => setDifficulty("hard")} />
              </div>
            </div>

            {/* Section 3: Questions */}
            <div>
              <SectionLabel number="03" label="Number of Questions" delay="0.28s" />
              <div className="is-fade-up" style={{ animationDelay:"0.3s", display:"flex", gap:10 }}>
                {[3,5,8,10].map(n => (
                  <button key={n} onClick={() => setQuestionCount(n)} style={{
                    padding:"10px 22px", borderRadius:10,
                    border: questionCount===n ? `2px solid ${v("--accent")}` : `1.5px solid ${v("--border")}`,
                    background: questionCount===n ? "rgba(166,87,63,0.06)" : v("--bg-card"),
                    color: questionCount===n ? v("--accent") : v("--text-primary"),
                    fontWeight:700, fontSize:"0.9rem", cursor:"pointer", transition:"all 0.18s",
                    boxShadow: questionCount===n ? "0 0 0 3px rgba(166,87,63,0.1)" : v("--shadow-card"),
                  }}
                    onMouseEnter={e => { if(questionCount!==n) e.currentTarget.style.borderColor="rgba(166,87,63,0.4)"; }}
                    onMouseLeave={e => { if(questionCount!==n) e.currentTarget.style.borderColor="var(--border)"; }}
                  >{n}</button>
                ))}
                <span style={{ display:"flex", alignItems:"center", fontSize:"0.8rem", color:v("--text-muted"), marginLeft:4 }}>questions</span>
              </div>
            </div>

            {/* Section 4: Focus Areas */}
            <div>
              <SectionLabel number="04" label="Focus Areas (optional)" delay="0.32s" />
              <div className="is-fade-up" style={{ animationDelay:"0.34s", display:"flex", flexWrap:"wrap", gap:8 }}>
                {allFocusAreas.map(area => {
                  const active = focusAreas.includes(area);
                  return (
                    <button key={area} onClick={() => toggleFocus(area)} style={{
                      padding:"7px 16px", borderRadius:99,
                      border: active ? `1.5px solid ${v("--accent")}` : `1.5px solid ${v("--border")}`,
                      background: active ? "rgba(166,87,63,0.08)" : v("--bg-card"),
                      color: active ? v("--accent") : v("--text-muted"),
                      fontSize:"0.8rem", fontWeight: active?600:500, cursor:"pointer", transition:"all 0.18s", fontFamily:"'Courier New',monospace",
                    }}
                      onMouseEnter={e => { if(!active) { e.currentTarget.style.borderColor="rgba(166,87,63,0.4)"; e.currentTarget.style.color="var(--accent)"; } }}
                      onMouseLeave={e => { if(!active) { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-muted)"; } }}
                    >{area}</button>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Target Role */}
            <div>
              <SectionLabel number="05" label="Target Role (optional)" delay="0.36s" />
              <div className="is-fade-up" style={{ animationDelay:"0.38s" }}>
                <input type="text" placeholder="e.g. Frontend Engineer at Google" value={customRole}
                  onChange={e => setCustomRole(e.target.value)}
                  style={{ width:"100%", padding:"13px 18px", borderRadius:12, border:`1.5px solid ${v("--border")}`, background:v("--bg-card"), color:v("--text-primary"), fontSize:"0.88rem", outline:"none", transition:"border-color 0.2s, box-shadow 0.2s", fontFamily:"inherit", boxSizing:"border-box" }}
                  onFocus={e => { e.target.style.borderColor="var(--accent)"; e.target.style.boxShadow="0 0 0 3px rgba(166,87,63,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor="var(--border)"; e.target.style.boxShadow="none"; }}
                />
              </div>
            </div>
          </div>

          {/* Right: Preview card */}
          <div style={{ width:280, flexShrink:0, position:"sticky", top:32 }}>
            <div className="is-fade-up" style={{ animationDelay:"0.1s", background:v("--bg-card"), border:`1px solid ${v("--border")}`, borderRadius:18, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.1)" }}>
              <div style={{ padding:"18px 22px", borderBottom:`1px solid ${v("--border")}`, background:v("--bg-primary") }}>
                <p style={{ fontSize:"0.65rem", letterSpacing:"0.16em", color:v("--text-muted"), textTransform:"uppercase", fontFamily:"'Courier New',monospace", marginBottom:4 }}>Session Preview</p>
                <p style={{ fontSize:"1.05rem", fontWeight:700, color:v("--text-primary") }}>{customRole||"Mock Interview"}</p>
              </div>
              <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:14 }}>
                <PreviewRow label="Type" value={interviewType ? interviewType.charAt(0).toUpperCase()+interviewType.slice(1) : "—"} />
                <PreviewRow label="Difficulty" value={difficulty ? difficulty.charAt(0).toUpperCase()+difficulty.slice(1) : "—"} valueColor={difficulty==="easy"?"#3a8f5e":difficulty==="medium"?"#C17D2B":"#B84040"} />
                <PreviewRow label="Questions" value={`${questionCount} questions`} />
                <PreviewRow label="Est. Time" value={`~${questionCount*4} minutes`} />
                <div>
                  <p style={{ fontSize:"0.68rem", color:v("--text-muted"), textTransform:"uppercase", letterSpacing:"0.1em", fontFamily:"'Courier New',monospace", marginBottom:6 }}>Focus Areas</p>
                  {focusAreas.length > 0 ? (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {focusAreas.map(a => (
                        <span key={a} style={{ padding:"3px 10px", borderRadius:99, background:"rgba(166,87,63,0.08)", border:"1px solid rgba(166,87,63,0.2)", fontSize:"0.7rem", color:v("--accent"), fontFamily:"'Courier New',monospace" }}>{a}</span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize:"0.78rem", color:v("--text-muted"), fontStyle:"italic" }}>None selected</p>
                  )}
                </div>
                <div style={{ height:1, background:v("--border") }} />
                <button
                  onClick={() => canStart && onStart && onStart({ interviewType, difficulty, questionCount, focusAreas, customRole })}
                  disabled={!canStart}
                  style={{ padding:13, borderRadius:11, border:"none", background:canStart?v("--text-primary"):"var(--border)", color:canStart?v("--bg-primary"):v("--text-muted"), fontWeight:700, fontSize:"0.88rem", cursor:canStart?"pointer":"not-allowed", transition:"all 0.2s", width:"100%", letterSpacing:"0.02em", boxShadow:canStart?"0 4px 14px rgba(28,33,39,0.18)":"none" }}
                  onMouseEnter={e => { if(canStart){ e.target.style.background="var(--accent)"; e.target.style.color="#F4F5F2"; e.target.style.transform="translateY(-1px)"; } }}
                  onMouseLeave={e => { if(canStart){ e.target.style.background="var(--text-primary)"; e.target.style.color="var(--bg-primary)"; e.target.style.transform="translateY(0)"; } }}
                >Start Interview →</button>
              </div>
            </div>

            {/* Tips */}
            <div className="is-fade-up" style={{ animationDelay:"0.2s", marginTop:14, background:"rgba(166,87,63,0.05)", border:"1px solid rgba(166,87,63,0.15)", borderRadius:14, padding:"16px 18px" }}>
              <p style={{ fontSize:"0.68rem", letterSpacing:"0.12em", color:v("--accent"), textTransform:"uppercase", fontFamily:"'Courier New',monospace", fontWeight:700, marginBottom:10 }}>💡 Tips</p>
              {["Start with Medium to gauge your baseline.","Pick focus areas matching your job description.","5–8 questions is the sweet spot for a full session."].map((tip, i) => (
                <p key={i} style={{ fontSize:"0.76rem", color:v("--text-muted"), lineHeight:1.55, marginBottom:i<2?8:0 }}>· {tip}</p>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewSetup;
