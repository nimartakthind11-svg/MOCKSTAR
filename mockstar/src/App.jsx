import React, { useState, useCallback } from "react";
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
  const [signupName, setSignupName] = useState(""); // persists name from signup to login
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

  // ✅ All hooks at the top level — never inside conditionals
  const { theme, toggleTheme } = useTheme();

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // Called after signup — saves name, modal slides to login tab automatically
  const handleSignupSuccess = (name) => {
    setSignupName(name);
  };

  // Called after login — transitions to dashboard using the saved signup name
  const handleLoginSuccess = () => {
    setUserProfile({
      username: signupName || "User",
      focusDomain: "",
      coreSkills: "",
      isBuilt: false
    });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView("dashboard");
    setSignupName("");
    setUserProfile({
      username: "",
      focusDomain: "",
      coreSkills: "",
      isBuilt: false
    });
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
          onStart={(config) => {
            setInterviewConfig(config);
            setCurrentView("interview-session");
          }}
        />
      );
    }

    if (currentView === "interview-session") {
      return (
        <InterviewSession 
          config={interviewConfig}
          onEnd={(transcript) => {
            // Compute score from transcript
            const candidateMsgs = transcript.filter(m => m.role === "candidate");
            const score = Math.min(65 + candidateMsgs.length * 5 + Math.floor(Math.random() * 10), 100);
            setCurrentSessionScore(score);
            setInterviewTranscript(transcript);

            // Record the completed session
            const newSession = {
              id: Date.now(),
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
          transcript={interviewTranscript}
          config={interviewConfig}
          score={currentSessionScore}
          onBackToDashboard={() => setCurrentView("dashboard")}
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
      <Navbar onAuthClick={() => openAuth("login")} onToggleTheme={toggleTheme} theme={theme} />
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