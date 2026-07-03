import React, { useState, useEffect, useRef } from "react";

const AuthModal = ({ isOpen, onClose, initialMode = "login", onLoginSuccess, onSignupSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [shake, setShake] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEmail("");
      setPassword("");
      setName("");
      setAgreeTerms(false);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && (!name || !agreeTerms))) {
      triggerShake();
      return;
    }
    if (mode === "signup") {
      if (onSignupSuccess) onSignupSuccess(name.trim());
      setEmail(""); setPassword(""); setAgreeTerms(false);
      setMode("login");
    } else {
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  /* ── Shared input field style ── */
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-md rounded-2xl p-8 relative overflow-hidden flex flex-col shadow-2xl transition-all duration-300 ${shake ? "animate-shake" : ""}`}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full transition-all focus:outline-none"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2 mb-2 self-start">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent)" }} />
          <span className="font-mono text-sm tracking-wide" style={{ color: "var(--text-primary)" }}>
            Mockstar by Mocktane
          </span>
        </div>

        <h2 className="text-3xl font-serif mb-6 mt-1 font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>

        {/* Tab switcher */}
        <div
          className="flex p-1.5 rounded-xl mb-6 relative"
          style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}
        >
          <div
            className="absolute top-1.5 bottom-1.5 left-1.5 rounded-lg shadow-sm transition-all duration-300 ease-out"
            style={{
              width: "calc(50% - 6px)",
              transform: mode === "login" ? "translateX(0)" : "translateX(100%)",
              background: "var(--bg-card)",
            }}
          />
          {["login", "signup"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="relative z-10 w-1/2 py-2 text-center text-sm font-semibold transition-colors duration-200"
              style={{ color: mode === m ? "var(--text-primary)" : "var(--text-muted)" }}
            >
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        {/* Sliding forms */}
        <div className="overflow-hidden w-full relative">
          <div
            className="flex w-[200%] transition-transform duration-500 ease-out"
            style={{ transform: mode === "login" ? "translateX(0%)" : "translateX(-50%)" }}
          >
            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="w-1/2 pr-2 flex flex-col">
              <div className="mb-5">
                <label style={labelStyle}>Email address</label>
                <input
                  type="email" id="login-email" value={email}
                  onChange={e => setEmail(e.target.value)} required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>

              <div className="mb-4 relative">
                <label style={labelStyle}>Password</label>
                <input
                  type={showPassword ? "text" : "password"} id="login-password" value={password}
                  onChange={e => setPassword(e.target.value)} required
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-3 transition-colors focus:outline-none"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex justify-end mb-6">
                <button type="button" className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg font-semibold active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer text-sm"
                style={{ background: "var(--accent)", color: "#F4F5F2" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--accent-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
              >
                Log In
              </button>
            </form>

            {/* SIGNUP FORM */}
            <form onSubmit={handleSubmit} className="w-1/2 pl-2 flex flex-col">
              <div className="mb-5">
                <label style={labelStyle}>Full name</label>
                <input
                  type="text" id="signup-name" value={name}
                  onChange={e => setName(e.target.value)} required={mode === "signup"}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>

              <div className="mb-5">
                <label style={labelStyle}>Email address</label>
                <input
                  type="email" id="signup-email" value={email}
                  onChange={e => setEmail(e.target.value)} required={mode === "signup"}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>

              <div className="mb-4 relative">
                <label style={labelStyle}>Password</label>
                <input
                  type={showPassword ? "text" : "password"} id="signup-password" value={password}
                  onChange={e => setPassword(e.target.value)} required={mode === "signup"}
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-3 transition-colors focus:outline-none"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex items-start gap-2 mb-5">
                <input
                  type="checkbox" id="agree-terms" checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  required={mode === "signup"}
                  className="mt-1 h-4 w-4 rounded cursor-pointer"
                  style={{ accentColor: "var(--accent)" }}
                />
                <label htmlFor="agree-terms" className="text-xs leading-tight select-none cursor-pointer" style={{ color: "var(--text-muted)" }}>
                  I agree to the{" "}
                  <button type="button" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>Terms of Service</button>
                  {" "}and{" "}
                  <button type="button" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>Privacy Policy</button>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg font-semibold active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer text-sm"
                style={{ background: "var(--accent)", color: "#F4F5F2" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--accent-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow border-t" style={{ borderColor: "var(--border)" }} />
          <span className="px-3 text-xs font-medium tracking-wider uppercase" style={{ color: "var(--text-muted)", background: "var(--bg-card)" }}>
            Or continue with
          </span>
          <div className="flex-grow border-t" style={{ borderColor: "var(--border)" }} />
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Google",
              icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              ),
            },
            {
              label: "GitHub",
              icon: (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              ),
            },
          ].map(({ label, icon }) => (
            <button
              key={label}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: "var(--bg-primary)",
                border: "1.5px solid var(--border)",
                color: "var(--text-primary)",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--text-muted)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
