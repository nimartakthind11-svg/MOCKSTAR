import React, { useState, useEffect, useRef } from "react";
import { getQuestionsForSession } from "../utils/questionBank";

const injectStyles = () => {
  if (document.getElementById("isession-styles")) return;
  const s = document.createElement("style");
  s.id = "isession-styles";
  s.textContent = `
    @keyframes isession-fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
    @keyframes isession-pulse { 0% { transform:scale(0.95); box-shadow:0 0 0 0 rgba(220,38,38,0.7); } 70% { transform:scale(1); box-shadow:0 0 0 6px rgba(220,38,38,0); } 100% { transform:scale(0.95); box-shadow:0 0 0 0 rgba(220,38,38,0); } }
    .isession-fade-up { animation: isession-fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }
    .transcript-scroll::-webkit-scrollbar { width:6px; }
    .transcript-scroll::-webkit-scrollbar-track { background:transparent; }
    .transcript-scroll::-webkit-scrollbar-thumb { background:var(--border); border-radius:4px; }
  `;
  document.head.appendChild(s);
};

const v = (n) => `var(${n})`;

const InterviewSession = ({ onEnd, config }) => {
  injectStyles();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const transcriptRef = useRef(null);
  const initialized = useRef(false);
  const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    if (config && messages.length === 0 && !initialized.current) {
      initialized.current = true;
      const qs = getQuestionsForSession(config);
      setSessionQuestions(qs);
      if (qs.length > 0) {
        setMessages([{ id: Date.now() + Math.random(), role: "interviewer", text: qs[0].text, time: nowTime() }]);
        setCurrentQIndex(1);
      } else {
        setMessages([{ id: Date.now(), role: "interviewer", text: "No questions available for this configuration.", time: nowTime() }]);
        setIsComplete(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.8) setTimeout(() => {}, 3000);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isAiThinking || isComplete) return;
    setMessages(prev => [...prev, { id: Date.now(), role: "candidate", text: inputValue, time: nowTime() }]);
    setInputValue("");
    setIsAiThinking(true);
    setTimeout(() => {
      if (currentQIndex < sessionQuestions.length) {
        setMessages(prev => [...prev, { id: Date.now() + Math.random(), role: "interviewer", text: sessionQuestions[currentQIndex].text, time: nowTime() }]);
        setCurrentQIndex(prev => prev + 1);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + Math.random(), role: "interviewer", text: "Thank you, that concludes our interview session.", time: nowTime() }]);
        setIsComplete(true);
      }
      setIsAiThinking(false);
    }, 1500);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) setInputValue("The virtual DOM is a lightweight copy of the actual DOM...");
  };

  return (
    <div style={{ height:"100vh", background:v("--bg-primary"), display:"flex", flexDirection:"column", overflow:"hidden", transition:"background 0.25s" }}>
      {/* Header */}
      <header style={{ height:64, background:v("--bg-card"), borderBottom:`1px solid ${v("--border")}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:v("--accent"), animation:"isession-pulse 2s infinite" }} />
          <span style={{ fontWeight:700, color:v("--text-primary"), letterSpacing:"0.04em", fontSize:"1.05rem", fontFamily:"'Courier New',monospace" }}>mockstar / session</span>
          <span style={{ padding:"4px 10px", background:"rgba(166,87,63,0.1)", color:v("--accent"), fontSize:"0.75rem", borderRadius:99, fontWeight:600, fontFamily:"'Courier New',monospace" }}>live</span>
        </div>
        <button
          onClick={() => onEnd(messages)}
          style={{ padding:"8px 16px", background:"transparent", border:`1.5px solid ${v("--border")}`, borderRadius:8, color:"#D33F3F", fontWeight:600, fontSize:"0.85rem", cursor:"pointer", transition:"all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background="rgba(211,63,63,0.08)"; e.currentTarget.style.borderColor="#D33F3F"; }}
          onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="var(--border)"; }}
        >End Interview</button>
      </header>

      {/* Body */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column", background:v("--bg-primary") }}>

          {/* Transcript */}
          <div className="transcript-scroll" ref={transcriptRef} style={{ flex:1, overflowY:"auto", padding:"40px 60px", display:"flex", flexDirection:"column", gap:24 }}>
            {messages.map((msg, idx) => {
              const isAI = msg.role === "interviewer";
              return (
                <div key={msg.id} className="isession-fade-up" style={{ animationDelay:`${Math.min(idx*0.1,0.5)}s`, display:"flex", flexDirection:"column", alignItems:isAI?"flex-start":"flex-end" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, opacity:0.7 }}>
                    <span style={{ fontSize:"0.75rem", fontWeight:700, color:v("--text-primary"), fontFamily:"'Courier New',monospace", textTransform:"uppercase" }}>{isAI?"Interviewer (AI)":"You"}</span>
                    <span style={{ fontSize:"0.7rem", color:v("--text-muted") }}>{msg.time}</span>
                  </div>
                  <div style={{
                    maxWidth:"80%", padding:"16px 20px",
                    borderRadius: isAI ? "0 16px 16px 16px" : "16px 0 16px 16px",
                    background: isAI ? v("--bg-card") : v("--text-primary"),
                    color: isAI ? v("--text-primary") : v("--bg-primary"),
                    border:`1px solid ${v("--border")}`,
                    lineHeight:1.6, fontSize:"0.95rem",
                    boxShadow:"0 2px 10px rgba(0,0,0,0.06)"
                  }}>{msg.text}</div>
                  {isAI && msg.tags && (
                    <div style={{ display:"flex", gap:8, marginTop:10 }}>
                      {msg.tags.map(tag => (
                        <span key={tag} style={{ padding:"4px 10px", background:"rgba(166,87,63,0.06)", border:"1px solid rgba(166,87,63,0.15)", borderRadius:6, fontSize:"0.7rem", color:v("--accent"), fontFamily:"'Courier New',monospace", fontWeight:600 }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {isAiThinking && <div className="isession-fade-up" style={{ fontSize:"0.8rem", color:v("--text-muted"), fontStyle:"italic" }}>Interviewer is typing…</div>}
            {isComplete && <div className="isession-fade-up" style={{ fontSize:"0.8rem", color:"#3a8f5e", fontWeight:600 }}>Interview complete. Click "End Interview" to see your results.</div>}
          </div>

          {/* Input bar */}
          <div style={{ padding:"20px 60px", background:v("--bg-card"), borderTop:`1px solid ${v("--border")}`, display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ flex:1, position:"relative", display:"flex", alignItems:"center" }}>
              <input
                type="text" value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key==="Enter" && handleSendMessage()}
                disabled={isAiThinking || isComplete}
                placeholder={isComplete ? "Interview complete" : "Type your response or use the mic..."}
                style={{ width:"100%", padding:"16px 20px", paddingRight:50, borderRadius:12, border:`1.5px solid ${v("--border")}`, background:v("--bg-primary"), color:v("--text-primary"), fontSize:"0.95rem", outline:"none", transition:"all 0.2s", boxSizing:"border-box" }}
                onFocus={e => e.currentTarget.style.borderColor="var(--accent)"}
                onBlur={e => e.currentTarget.style.borderColor="var(--border)"}
              />
              <button onClick={handleSendMessage} style={{ position:"absolute", right:12, background:"none", border:"none", color:inputValue.trim()?"var(--accent)":"var(--text-muted)", cursor:inputValue.trim()?"pointer":"default", display:"flex", alignItems:"center", padding:8, transition:"color 0.2s" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <button
              onClick={toggleRecording}
              style={{ width:52, height:52, borderRadius:"50%", background:isRecording?"rgba(211,63,63,0.12)":v("--text-primary"), border:isRecording?"2px solid #D33F3F":`2px solid ${v("--text-primary")}`, color:isRecording?"#D33F3F":v("--bg-primary"), display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, transition:"all 0.2s", boxShadow:isRecording?"0 0 0 4px rgba(211,63,63,0.15)":"0 4px 10px rgba(0,0,0,0.15)" }}
            >
              {isRecording ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
