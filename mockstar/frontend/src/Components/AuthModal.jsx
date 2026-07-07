import React, { useState, useEffect, useRef } from "react";

const FEATURES = [
  {
    text: "Resume-matched interview questions",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    ),
  },
  {
    text: "Real-time AI feedback and scoring",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    text: "Track progress across sessions",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

const FieldIcons = {
  user: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
    </svg>
  ),
  email: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  lock: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
};

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

const AuthInput = ({ label, icon, id, type = "text", value, onChange, placeholder, required, rightSlot }) => (
  <div className="auth-field">
    <label htmlFor={id} className="auth-label">{label}</label>
    <div className="auth-input-wrap">
      <span className="auth-input-icon" aria-hidden="true">{icon}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`auth-input${rightSlot ? " auth-input--has-action" : ""}`}
      />
      {rightSlot}
    </div>
  </div>
);

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
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && (!name || !agreeTerms))) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
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

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  const passwordToggle = (
    <button
      type="button"
      className="auth-password-toggle"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      <EyeIcon open={showPassword} />
    </button>
  );

  const socialProviders = [
    {
      id: "google",
      label: "Google",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
      ),
    },
    {
      id: "github",
      label: "GitHub",
      icon: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="auth-backdrop animate-fadeIn" onClick={handleBackdropClick}>
      <div className="auth-orb auth-orb--1" aria-hidden="true" />
      <div className="auth-orb auth-orb--2" aria-hidden="true" />

      <div
        ref={modalRef}
        className={`auth-modal ${shake ? "animate-shake" : "animate-scaleIn"}`}
      >
        <div className="auth-modal-border" aria-hidden="true" />
        <div className="auth-shimmer-bar" aria-hidden="true" />

        <button onClick={onClose} className="auth-close" aria-label="Close modal">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="auth-layout">
          <aside className="auth-panel">
            <div className="auth-panel-glow" aria-hidden="true" />
            <div className="auth-panel-grid" aria-hidden="true" />

            <div className="auth-panel-content">
              <div className="auth-brand">
                <div className="auth-brand-icon">
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1L7.8 4.2L11 4.8L8.6 7.2L9.2 10.5L6 8.8L2.8 10.5L3.4 7.2L1 4.8L4.2 4.2L6 1Z" fill="white" />
                  </svg>
                </div>
                <span className="auth-brand-name">Mockstar</span>
              </div>

              <h2 className="auth-panel-title">
                {mode === "login" ? (
                  <>Ace your next <em>interview</em></>
                ) : (
                  <>Start practicing <em>today</em></>
                )}
              </h2>

              <p className="auth-panel-sub">
                {mode === "login"
                  ? "Pick up where you left off and keep sharpening your answers."
                  : "Join thousands of candidates preparing smarter with AI."}
              </p>

              <ul className="auth-features">
                {FEATURES.map(({ icon, text }) => (
                  <li key={text} className="auth-feature">
                    <span className="auth-feature-icon">{icon}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="auth-form-panel">
            <div className="auth-form-header">
              <span className="ms-badge auth-mode-badge">
                <span className="auth-mode-dot" />
                {mode === "login" ? "Welcome back" : "Get started free"}
              </span>
              <h3 className="auth-form-title">
                {mode === "login" ? "Log in to your account" : "Create your account"}
              </h3>
              <p className="auth-form-sub">
                {mode === "login"
                  ? "Enter your credentials to continue."
                  : "Set up your profile in under a minute."}
              </p>
            </div>

            <div className="auth-social">
              {socialProviders.map(({ id, label, icon }) => (
                <button
                  key={id}
                  type="button"
                  className="auth-social-btn"
                  disabled
                  title="Coming soon"
                  aria-label={`${mode === "login" ? "Log in" : "Sign up"} with ${label} (coming soon)`}
                >
                  {icon}
                  {mode === "login" ? "Log in" : "Sign up"} with {label}
                </button>
              ))}
            </div>

            <div className="auth-divider">
              <span>Or use email</span>
            </div>

            <div className="auth-tabs" role="tablist">
              <div
                className="auth-tabs-slider"
                style={{ transform: mode === "login" ? "translateX(0)" : "translateX(100%)" }}
              />
              {["login", "signup"].map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={`auth-tab ${mode === m ? "auth-tab--active" : ""}`}
                >
                  {m === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            <div className="auth-forms-viewport">
              <div
                className="auth-forms-track"
                style={{ transform: mode === "login" ? "translateX(0%)" : "translateX(-50%)" }}
              >
                <form onSubmit={handleSubmit} className="auth-form">
                  <AuthInput
                    label="Email address"
                    icon={FieldIcons.email}
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />

                  <AuthInput
                    label="Password"
                    icon={FieldIcons.lock}
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    rightSlot={passwordToggle}
                  />

                  <div className="auth-forgot-row">
                    <button type="button" className="auth-link">Forgot password?</button>
                  </div>

                  <button type="submit" className="auth-submit">
                    <span>Log In</span>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </form>

                <form onSubmit={handleSubmit} className="auth-form">
                  <AuthInput
                    label="Full name"
                    icon={FieldIcons.user}
                    id="signup-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    required={mode === "signup"}
                  />

                  <AuthInput
                    label="Email address"
                    icon={FieldIcons.email}
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required={mode === "signup"}
                  />

                  <AuthInput
                    label="Password"
                    icon={FieldIcons.lock}
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required={mode === "signup"}
                    rightSlot={passwordToggle}
                  />

                  <div className="auth-terms">
                    <input
                      type="checkbox"
                      id="agree-terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      required={mode === "signup"}
                      className="auth-checkbox"
                    />
                    <label htmlFor="agree-terms">
                      I agree to the{" "}
                      <button type="button" className="auth-link">Terms of Service</button>
                      {" "}and{" "}
                      <button type="button" className="auth-link">Privacy Policy</button>
                    </label>
                  </div>

                  <button type="submit" className="auth-submit">
                    <span>Create Account</span>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
