import React, { useEffect } from "react";

/* ── Inject print styles ── */
const injectPrintStyles = () => {
  if (document.getElementById("print-styles")) return;
  const s = document.createElement("style");
  s.id = "print-styles";
  s.textContent = `
    @media print {
      body { background: white !important; padding: 0 !important; margin: 0 !important; }
      .no-print { display: none !important; }
      .print-shadow-none { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
      .page-break-inside-avoid { page-break-inside: avoid; break-inside: avoid; }
    }
  `;
  document.head.appendChild(s);
};

const PerformanceReport = ({ transcript, config, score: scoreProp, onBackToDashboard }) => {
  useEffect(() => {
    injectPrintStyles();
  }, []);

  // Use the pre-computed score passed from App so it matches what's stored in session history.
  // Fall back to calculating if not provided (e.g. direct render without App context).
  const score = scoreProp ?? (() => {
    if (!transcript || transcript.length === 0) return 0;
    const candidateMessages = transcript.filter(m => m.role === "candidate");
    return Math.min(65 + candidateMessages.length * 5 + Math.floor(Math.random() * 10), 100);
  })();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F4F5F2", padding: "40px 20px" }}>
      <div className="print-shadow-none" style={{ maxWidth: 800, margin: "0 auto", background: "#fff", borderRadius: 16, border: "1px solid #DCDAD2", padding: 40, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: "rgba(166,87,63,0.1)", color: "#A6573F", marginBottom: 16 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1C2127", marginBottom: 8 }}>Interview Completed</h1>
          <p style={{ color: "#5F5E5A", fontSize: "1rem" }}>Here is a summary of your performance.</p>
        </div>

        {/* Score Section */}
        <div style={{ display: "flex", gap: 24, marginBottom: 40 }}>
          <div style={{ flex: 1, background: "#FAFAF8", border: "1px solid #DCDAD2", borderRadius: 12, padding: 24, textAlign: "center" }}>
            <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#5F5E5A", fontWeight: 700, marginBottom: 12 }}>Overall Score</h3>
            <div style={{ fontSize: "3.5rem", fontWeight: 800, color: "#A6573F", lineHeight: 1 }}>{score}<span style={{ fontSize: "1.5rem", color: "#BDBBB3" }}>/100</span></div>
          </div>
          <div style={{ flex: 2, background: "#FAFAF8", border: "1px solid #DCDAD2", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#5F5E5A", fontWeight: 700, marginBottom: 12 }}>Feedback Summary</h3>
            <p style={{ color: "#1C2127", lineHeight: 1.6, fontSize: "0.95rem" }}>
              {score >= 80 
                ? "Excellent job! You provided structured, detailed answers and navigated the follow-up questions well. Keep up this level of depth."
                : score >= 60
                ? "Good effort. Your foundational knowledge is solid, but you could elaborate more on your thought process and provide specific examples during follow-ups."
                : "You completed the session, but there is room for improvement. Try to expand on your answers and tackle complex questions step-by-step."
              }
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1C2127", marginBottom: 16 }}>Session Details</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #F0EEE8" }}>
              <span style={{ color: "#5F5E5A", fontWeight: 600 }}>Interview Type</span>
              <span style={{ color: "#1C2127", fontWeight: 700, textTransform: "capitalize" }}>{config?.interviewType || "Mixed"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #F0EEE8" }}>
              <span style={{ color: "#5F5E5A", fontWeight: 600 }}>Difficulty</span>
              <span style={{ color: "#1C2127", fontWeight: 700, textTransform: "capitalize" }}>{config?.difficulty || "Medium"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #F0EEE8" }}>
              <span style={{ color: "#5F5E5A", fontWeight: 600 }}>Questions Answered</span>
              <span style={{ color: "#1C2127", fontWeight: 700 }}>
                {transcript?.filter(m => m.role === "candidate").length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Session History */}
        {transcript && transcript.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1C2127", marginBottom: 16 }}>Session History</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {transcript.map((msg, idx) => (
                <div key={idx} className="page-break-inside-avoid" style={{ padding: "20px", borderRadius: "12px", background: msg.role === "interviewer" ? "#FAFAF8" : "#fff", border: "1px solid #EAE8E1" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: "700", color: msg.role === "interviewer" ? "#A6573F" : "#1C2127", marginBottom: "8px", textTransform: "uppercase" }}>
                    {msg.role === "interviewer" ? "Interviewer" : "You"}
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "#1C2127", lineHeight: "1.6" }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="no-print" style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button 
            onClick={onBackToDashboard}
            style={{
              padding: "14px 32px",
              background: "#fff",
              color: "#1C2127",
              border: "1px solid #1C2127",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "transform 0.2s, background 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#FAFAF8"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Back to Dashboard
          </button>
          <button 
            onClick={handlePrint}
            style={{
              padding: "14px 32px",
              background: "#1C2127",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "transform 0.2s, background 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#2A2E35"}
            onMouseLeave={e => e.currentTarget.style.background = "#1C2127"}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
};

export default PerformanceReport;
