import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import FooterSteps from "./Components/FooterSteps";
import AuthModal from "./Components/AuthModal";
import Dashboard from "./Components/Dashboard";
import BuildProfile from "./Components/BuildProfile";
import ResumeUpload from "./Components/ResumeUpload";
import InterviewSetup from "./Components/InterviewSetup";

function App() {
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
            // Future: pass config to interview session
            console.log("Starting interview with config:", config);
          }}
        />
      );
    }

    return (
      <Dashboard 
        userProfile={userProfile}
        onLogout={handleLogout}
        onEditProfile={() => setCurrentView("build-profile")}
        onUploadResume={() => setCurrentView("resume-upload")}
      />
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#F4F5F2] relative"> 
      <Navbar onAuthClick={() => openAuth("login")} />
      <Hero onStartPractice={() => openAuth("signup")} />
      <FooterSteps />
      
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

export default App;