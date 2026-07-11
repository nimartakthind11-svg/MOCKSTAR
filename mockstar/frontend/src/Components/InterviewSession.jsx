import React, { useState, useEffect, useRef } from "react";

const injectStyles = () => {
  if (document.getElementById("isession-styles")) return;
  const s = document.createElement("style");
  s.id = "isession-styles";
  s.textContent = `
    @keyframes isession-fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes isession-pulse  { 0% { transform:scale(0.95); box-shadow:0 0 0 0 rgba(220,38,38,0.7); } 70% { transform:scale(1); box-shadow:0 0 0 8px rgba(220,38,38,0); } 100% { transform:scale(0.95); box-shadow:0 0 0 0 rgba(220,38,38,0); } }
    @keyframes livePulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.82); } }
    .isession-fade-up { animation: isession-fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
    .transcript-scroll::-webkit-scrollbar { width:5px; }
    .transcript-scroll::-webkit-scrollbar-track { background:transparent; }
    .transcript-scroll::-webkit-scrollbar-thumb { background:var(--border-strong); border-radius:999px; }
    .typing-dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--text-muted); margin:0 2px; animation:typingBounce 1.2s ease-in-out infinite; }
    .typing-dot:nth-child(2) { animation-delay:0.15s; }
    .typing-dot:nth-child(3) { animation-delay:0.3s; }
    @keyframes typingBounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-5px); } }
  `;
  document.head.appendChild(s);
};

const v = (n) => `var(${n})`;

const InterviewSession = ({ onEnd, config }) => {
  injectStyles();
  const [messages, setMessages]             = useState([]);
  const [inputValue, setInputValue]         = useState("");
  const [isRecording, setIsRecording]       = useState(false);
  const [isAiThinking, setIsAiThinking]     = useState(false);
  const [isComplete, setIsComplete]         = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex]   = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const transcriptRef = useRef(null);
  const initialized   = useRef(false);
  const inputRef      = useRef(null);
  const VOICE_RECORDING_ENABLED = false;
  const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Real tab-switch / focus-loss tracking for the integrity indicator.
  // Every time the tab is hidden (switched away, minimized, etc.) during
  // an active session, we count it — this feeds the "Integrity" score on
  // the report instead of a hardcoded value.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isComplete) {
        setTabSwitchCount(prev => prev + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  // Detect pasted answers (candidate pasting a pre-written/AI-generated
  // response instead of typing their own answer live). Counted separately
  // from tab switches but rolled into the same integrity score.
  const handlePaste = () => {
    if (!isComplete) {
      setPasteCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (config && messages.length === 0 && !initialized.current) {
      initialized.current = true;
      // Only ever use backend-provided questions. If they're missing, this
      // means session creation failed upstream — surface that clearly
      // instead of silently generating local placeholder questions.
      const qs = config.questions && config.questions.length > 0
        ? config.questions.map((text, idx) => ({ id: `api_${idx}`, text }))
        : [];
      setSessionQuestions(qs);
      if (qs.length > 0) {
        setMessages([{ id: Date.now() + Math.random(), role: "interviewer", text: qs[0].text, time: nowTime() }]);
        setCurrentQIndex(1);
      } else {
        setMessages([{
          id: Date.now(),
          role: "interviewer",
          text: "We couldn't load interview questions for this session. Please go back and start a new session.",
          time: nowTime(),
        }]);
        setIsComplete(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isAiThinking || isComplete) return;
    setMessages(prev => [...prev, { id: Date.now(), role: "candidate", text: inputValue, time: nowTime() }]);
    setInputValue("");
    // Questions come pre-loaded from the backend for this session, so there's
    // no real "thinking" happening here — advance immediately rather than
    // faking a generation delay.
    if (currentQIndex < sessionQuestions.length) {
      setMessages(prev => [...prev, { id: Date.now() + Math.random(), role: "interviewer", text: sessionQuestions[currentQIndex].text, time: nowTime() }]);
      setCurrentQIndex(prev => prev + 1);
    } else {
      setMessages(prev => [...prev, { id: Date.now() + Math.random(), role: "interviewer", text: "Thank you, that concludes our interview session. Great effort!", time: nowTime() }]);
      setIsComplete(true);
    }
  };

  const toggleRecording = () => {
  if (!VOICE_RECORDING_ENABLED) {
    alert("Voice recording coming soon!");
    return;
  }

  setIsRecording(!isRecording);

  // Future Web Speech API implementation
};

  const progressPercent = sessionQuestions.length > 0
    ? Math.round(((currentQIndex - 1) / sessionQuestions.length) * 100)
    : 0;

  return (
    <div style={{ height: "100vh", background: v("--bg-primary"), display: "flex", flexDirection: "column", overflow: "hidden", transition: "background 0.3s" }}>

      {/* Header */}
      <header
        style={{
          height: 60,
          background: v("--bg-card"),
          borderBottom: `1px solid ${v("--border")}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          flexShrink: 0,
          boxShadow: v("--shadow-xs"),
        }}
      >
        {/* Left: brand + live */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
                boxShadow: "0 0 8px var(--accent-glow)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L7.8 4.2L11 4.8L8.6 7.2L9.2 10.5L6 8.8L2.8 10.5L3.4 7.2L1 4.8L4.2 4.2L6 1Z" fill="white" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: v("--text-primary"), fontSize: "1rem" }}>Mockstar</span>
            <span style={{ color: v("--border-strong"), fontSize: 12 }}>/</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: v("--text-muted") }}>session</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 10px",
              background: "#D33F3F18",
              border: "1px solid #D33F3F33",
              borderRadius: 999,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#D33F3F",
                display: "inline-block",
                animation: "livePulse 1.5s ease-in-out infinite",
              }}
            />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", fontWeight: 600, color: "#D33F3F", letterSpacing: "0.06em", textTransform: "uppercase" }}>LIVE</span>
          </div>

          {(tabSwitchCount > 0 || pasteCount > 0) && (
            <div
              title="Tab switches and pasted answers lower your integrity score"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                background: "#C17D2B18",
                border: "1px solid #C17D2B44",
                borderRadius: 999,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C17D2B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", fontWeight: 600, color: "#C17D2B" }}>
                {tabSwitchCount > 0 && `Tab switches: ${tabSwitchCount}`}
                {tabSwitchCount > 0 && pasteCount > 0 && " · "}
                {pasteCount > 0 && `Pastes: ${pasteCount}`}
              </span>
            </div>
          )}
        </div>

        {/* Center: progress */}
        {sessionQuestions.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, maxWidth: 300, margin: "0 24px" }}>
            <div style={{ flex: 1, height: 4, background: v("--border"), borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progressPercent}%`,
                  background: "linear-gradient(90deg, var(--accent), var(--accent-light))",
                  borderRadius: 999,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: v("--text-muted"), whiteSpace: "nowrap" }}>
              {Math.min(currentQIndex - 1, sessionQuestions.length)}/{sessionQuestions.length}
            </span>
          </div>
        )}

        {/* Right: End button */}
        <button
          onClick={() => onEnd(messages, tabSwitchCount, pasteCount)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            background: "transparent",
            border: "1.5px solid var(--border-strong)",
            borderRadius: 999,
            color: "#D33F3F",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "0.83rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(211,63,63,0.08)"; e.currentTarget.style.borderColor = "#D33F3F"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/></svg>
          End Interview
        </button>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: v("--bg-primary") }}>

          {/* Transcript */}
          <div
            className="transcript-scroll"
            ref={transcriptRef}
            style={{ flex: 1, overflowY: "auto", padding: "36px 48px", display: "flex", flexDirection: "column", gap: 28 }}
          >
            {messages.map((msg, idx) => {
              const isAI = msg.role === "interviewer";
              return (
                <div
                  key={msg.id}
                  className="isession-fade-up"
                  style={{
                    animationDelay: `${Math.min(idx * 0.08, 0.4)}s`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isAI ? "flex-start" : "flex-end",
                    maxWidth: "75%",
                    alignSelf: isAI ? "flex-start" : "flex-end",
                  }}
                >
                  {/* Label */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7, opacity: 0.7 }}>
                    {isAI && (
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1L7.8 4.2L11 4.8L8.6 7.2L9.2 10.5L6 8.8L2.8 10.5L3.4 7.2L1 4.8L4.2 4.2L6 1Z" fill="white" />
                        </svg>
                      </div>
                    )}
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", fontWeight: 700, color: isAI ? v("--accent") : v("--text-muted"), textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {isAI ? "Interviewer" : "You"}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: v("--text-faint") }}>{msg.time}</span>
                  </div>

                  {/* Bubble */}
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: isAI ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                      background: isAI ? v("--bg-card") : v("--accent"),
                      color: isAI ? v("--text-primary") : "#F8F5F2",
                      border: isAI ? `1px solid ${v("--border")}` : "none",
                      lineHeight: 1.65,
                      fontSize: "0.93rem",
                      boxShadow: isAI ? v("--shadow-sm") : `0 4px 16px var(--accent-glow)`,
                      borderLeft: isAI ? `3px solid ${v("--accent")}` : "none",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isAiThinking && (
              <div className="isession-fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", maxWidth: "75%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7, opacity: 0.7 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-light))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.8 4.2L11 4.8L8.6 7.2L9.2 10.5L6 8.8L2.8 10.5L3.4 7.2L1 4.8L4.2 4.2L6 1Z" fill="white" /></svg>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", fontWeight: 700, color: v("--accent"), textTransform: "uppercase" }}>Interviewer</span>
                </div>
                <div style={{ padding: "14px 18px", borderRadius: "4px 16px 16px 16px", background: v("--bg-card"), border: `1px solid ${v("--border")}`, borderLeft: `3px solid ${v("--accent")}`, boxShadow: v("--shadow-sm"), display: "flex", alignItems: "center", gap: 2 }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {/* Complete message */}
            {isComplete && (
              <div className="isession-fade-up" style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    background: "#3a8f5e18",
                    border: "1px solid #3a8f5e44",
                    borderRadius: 999,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#3a8f5e",
                  }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  Interview complete · Click "End Interview" to see your results
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div
            style={{
              padding: "16px 32px 20px",
              background: v("--bg-card"),
              borderTop: `1px solid ${v("--border")}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onPaste={handlePaste}
                onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                disabled={isAiThinking || isComplete}
                placeholder={isComplete ? "Interview complete" : "Type your response…"}
                style={{
                  width: "100%",
                  padding: "14px 52px 14px 20px",
                  borderRadius: 14,
                  border: `1.5px solid ${v("--border")}`,
                  background: v("--bg-primary"),
                  color: v("--text-primary"),
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.93rem",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxSizing: "border-box",
                  opacity: isComplete ? 0.5 : 1,
                }}
                onFocus={e => { if (!isComplete) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "var(--shadow-glow)"; } }}
                onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  position: "absolute",
                  right: 10,
                  background: inputValue.trim() && !isComplete ? v("--accent") : "transparent",
                  border: "none",
                  borderRadius: 10,
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: inputValue.trim() && !isComplete ? "#F8F5F2" : v("--text-muted"),
                  cursor: inputValue.trim() && !isComplete ? "pointer" : "default",
                  transition: "all 0.2s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>

            {/* Mic button */}
            <button
              onClick={toggleRecording}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: isRecording ? "rgba(211,63,63,0.10)" : v("--accent"),
                border: isRecording ? "2px solid #D33F3F" : "none",
                color: isRecording ? "#D33F3F" : "#F8F5F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.2s",
                boxShadow: isRecording ? "0 0 0 4px rgba(211,63,63,0.15)" : "0 4px 12px var(--accent-glow)",
                animation: isRecording ? "isession-pulse 1.5s infinite" : "none",
              }}
            >
              {isRecording ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
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
