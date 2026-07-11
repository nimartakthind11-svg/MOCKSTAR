import React, { useState, useCallback, useEffect } from "react";
import { getToken, clearToken, profileApi, sessionApi } from "./utils/api";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Landing from "./Components/Landing";
import AuthModal from "./Components/AuthModal";
import Dashboard from "./Components/Dashboard";
import BuildProfile from "./Components/BuildProfile";
import ResumeUpload from "./Components/ResumeUpload";
import InterviewSetup from "./Components/InterviewSetup";
import InterviewSession from "./Components/InterviewSession";
import PerformanceReport from "./Components/PerformanceReport";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function AppInner() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [signupName, setSignupName] = useState("");
  const [userProfile, setUserProfile] = useState({
    username: "",
    focusDomain: "",
    coreSkills: "",
    isBuilt: false
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [interviewTranscript, setInterviewTranscript] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSessionScore, setCurrentSessionScore] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentSessionIntegrity, setCurrentSessionIntegrity] = useState(100);
  const [currentSessionIntegrityDetail, setCurrentSessionIntegrityDetail] = useState({ tabSwitchCount: 0, pasteCount: 0 });
  const [aiReport, setAiReport] = useState(null);
  const [sessionStartError, setSessionStartError] = useState(null);

  // ✅ All hooks at the top level — never inside conditionals
  const { theme, toggleTheme } = useTheme();

  // Auto-login: if a valid token exists in localStorage, fetch the profile
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    profileApi.get()
      .then((profile) => {
        setUserProfile({
          username: profile.username || "",
          focusDomain: profile.focus_domain || "",
          coreSkills: profile.core_skills || "",
          isBuilt: profile.is_built || false,
        });
        setIsLoggedIn(true);
        // Load past sessions
        return sessionApi.list();
      })
      .then((pastSessions) => {
        if (pastSessions && pastSessions.length) {
          setSessions(pastSessions.map((s) => ({
            id: s.id,
            role: s.custom_role || s.interview_type || "Practice Session",
            date: new Date(s.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
            score: s.score || 0,
            scoreColor: (s.score || 0) >= 80 ? "#3a8f5e" : (s.score || 0) >= 60 ? "#b07d2e" : "#D33F3F",
          })));
        }
      })
      .catch(() => clearToken()); // Token expired or invalid — clear it
  }, []);

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // Called after signup — saves name, modal slides to login tab automatically
  const handleSignupSuccess = (name) => {
    setSignupName(name);
  };

  // Called after login — receives real user object from API
  const handleLoginSuccess = (user) => {
    profileApi.get()
      .then((profile) => {
        setUserProfile({
          username: profile.username || signupName || user.email?.split("@")[0] || "User",
          focusDomain: profile.focus_domain || "",
          coreSkills: profile.core_skills || "",
          isBuilt: profile.is_built || false,
        });
        setIsLoggedIn(true);
        return sessionApi.list();
      })
      .then((pastSessions) => {
        if (pastSessions && pastSessions.length) {
          setSessions(pastSessions.map((s) => ({
            id: s.id,
            role: s.custom_role || s.interview_type || "Practice Session",
            date: new Date(s.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
            score: s.score || 0,
            scoreColor: (s.score || 0) >= 80 ? "#3a8f5e" : (s.score || 0) >= 60 ? "#b07d2e" : "#D33F3F",
          })));
        }
      })
      .catch(console.error);
  };

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    setCurrentView("dashboard");
    setSignupName("");
    setSessions([]);
    setUserProfile({ username: "", focusDomain: "", coreSkills: "", isBuilt: false });
  };

  if (isLoggedIn) {
    if (currentView === "build-profile") {
      return (
        <BuildProfile 
          initialProfile={userProfile}
          onSave={(profileData) => {
            setUserProfile(profileData);
            setCurrentView("dashboard");
          }}
          onCancel={() => setCurrentView("dashboard")}
        />
      );
    }

    if (currentView === "resume-upload") {
      return (
        <ResumeUpload
          onBack={() => setCurrentView("dashboard")}
          onContinue={() => setCurrentView("interview-setup")}
        />
      );
    }

    if (currentView === "interview-setup") {
      return (
        <InterviewSetup
          onBack={() => setCurrentView("resume-upload")}
          startError={sessionStartError}
          onStart={async (config) => {
            setSessionStartError(null);
            try {
              const res = await sessionApi.start(config);
              if (!res || !res.questions || res.questions.length === 0) {
                throw new Error("Server did not return any interview questions.");
              }
              setCurrentSessionId(res.session_id);
              setInterviewConfig({
                ...config,
                questions: res.questions
              });
              setCurrentView("interview-session");
            } catch (err) {
              console.error("Failed to start session:", err);
              setCurrentSessionId(null);
              setInterviewConfig(null);
              setSessionStartError(
                "We couldn't start your interview session. Please check your connection and try again."
              );
              // Deliberately do NOT navigate to interview-session here —
              // there are no real backend questions to show.
            }
          }}
        />
      );
    }

    if (currentView === "interview-session") {
      return (
        <InterviewSession 
          config={interviewConfig}
          onEnd={async (transcript, tabSwitchCount = 0, pasteCount = 0) => {
            let evaluation = null;
            let finalScore = null;
            let evaluationFailed = false;

            if (currentSessionId) {
              try {
                const formattedTranscript = transcript.map(m => ({
                  role: m.role,
                  text: m.text,
                  time: m.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }));
                await sessionApi.submit(currentSessionId, formattedTranscript);
                const report = await sessionApi.getReport(currentSessionId);
                evaluation = report;
                finalScore = report.score;
              } catch (err) {
                console.error("Error submitting session:", err);
                evaluationFailed = true;
              }
            }

            const score = finalScore ?? evaluation?.score ?? Math.min(65 + transcript.filter(m => m.role === "candidate").length * 5, 100);
            // Real integrity score based on detected tab switches and pasted
            // answers during the session, instead of a hardcoded 100%.
            // Tab switches cost 10 points each, pastes cost 15 each
            // (pasting a pre-written answer is a stronger integrity signal
            // than briefly switching tabs), floored at 0.
            const integrity = Math.max(0, 100 - tabSwitchCount * 10 - pasteCount * 15);
            setCurrentSessionScore(score);
            setCurrentSessionIntegrity(integrity);
            setCurrentSessionIntegrityDetail({ tabSwitchCount, pasteCount });
            setInterviewTranscript(transcript);
            setAiReport(
              evaluation ||
              (evaluationFailed
                ? { feedback: "AI evaluation couldn't be generated for this session (the evaluation request failed). Showing an estimated score instead.", strengths: [], weaknesses: [] }
                : null)
            );

            // Record the completed session in local state
            const newSession = {
              id: currentSessionId || Date.now(),
              role: interviewConfig?.customRole || interviewConfig?.interviewType || "Practice Session",
              date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
              score,
              scoreColor: score >= 80 ? "#3a8f5e" : score >= 60 ? "#b07d2e" : "#D33F3F",
            };
            setSessions(prev => [newSession, ...prev]);
            setCurrentView("performance-report");
          }}
        />
      );
    }

    if (currentView === "performance-report") {
      return (
        <PerformanceReport
          report={{
            score: currentSessionScore,
            integrity: currentSessionIntegrity,
            integrityDetail: currentSessionIntegrityDetail,
            date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
            role: interviewConfig?.customRole || interviewConfig?.interviewType || "Practice Session",
            type: interviewConfig?.interviewType,
            difficulty: interviewConfig?.difficulty,
            questionsCount: interviewConfig?.questionCount,
            transcript: interviewTranscript,
            // AI evaluation data
            feedback: aiReport?.feedback || null,
            strengths: aiReport?.strengths || [],
            weaknesses: aiReport?.weaknesses || [],
          }}
          onBackToDash={() => setCurrentView("dashboard")}
          onRetry={() => setCurrentView("interview-setup")}
        />
      );
    }

    return (
      <Dashboard 
        userProfile={userProfile}
        sessions={sessions}
        onLogout={handleLogout}
        onEditProfile={() => setCurrentView("build-profile")}
        onUploadResume={() => setCurrentView("resume-upload")}
        onStartSession={() => setCurrentView("resume-upload")}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentView={currentView}
        onNavigate={setCurrentView}
      />
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col relative"
      style={{ background: "var(--bg-primary)" }}
    >
      <Navbar onAuthClick={openAuth} onToggleTheme={toggleTheme} theme={theme} />
      <Hero onStartPractice={() => openAuth("signup")} />
      <Landing onStartPractice={() => openAuth("signup")} />
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialMode={authMode}
        onSignupSuccess={handleSignupSuccess}
        onLoginSuccess={handleLoginSuccess}
      />
    </main>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;