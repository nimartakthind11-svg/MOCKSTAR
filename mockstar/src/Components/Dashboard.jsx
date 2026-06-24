import React from "react";

const Dashboard = ({ onLogout, userProfile, onEditProfile, onUploadResume }) => {
  // No sessions yet — will be populated from real data in future
  const sessions = [];

  return (
    <div className="min-h-screen bg-[#F4F5F2] text-[#1C2127] flex flex-col animate-fadeIn">
      {/* Top Navbar */}
      <nav className="w-full flex items-center justify-between px-16 py-6 border-b border-[#DCDAD2] bg-[#F4F5F2]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#A6573F]" />
          <span className="font-mono text-lg tracking-wide text-[#1C2127] font-semibold">
            Mockstar by Mocktane
          </span>
        </div>
        <div className="flex items-center gap-6">
          {userProfile?.isBuilt && (
            <button
              onClick={onEditProfile}
              className="text-sm font-medium text-[#5F5E5A] hover:text-[#A6573F] transition-all cursor-pointer"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={onLogout}
            className="text-sm font-medium text-[#5F5E5A] hover:text-[#A6573F] hover:underline transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Dashboard Container */}
      <main className="max-w-4xl mx-auto w-full px-6 py-12 flex-1 flex flex-col gap-8">
        
        {/* Profile Incomplete Banner */}
        {!userProfile?.isBuilt && (
          <div className="bg-[#A6573F]/10 border border-[#A6573F]/30 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-[#A6573F] text-xl">⚠️</span>
              <span className="text-[#1C2127] text-sm font-medium">
                Your profile is incomplete. Build your profile to unlock focus domains and stats.
              </span>
            </div>
            <button
              onClick={onEditProfile}
              className="px-4 py-2 bg-[#A6573F] text-[#F4F5F2] hover:bg-[#914731] rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors"
            >
              Build Profile
            </button>
          </div>
        )}

        {/* Welcome Heading and Muted Domain Subtitle */}
        <div>
          <h1 className="text-5xl font-serif font-bold text-[#1C2127] tracking-tight">
            Welcome, {userProfile?.username || "User"}
          </h1>
          <p className="text-[#5F5E5A] mt-2 font-mono text-sm uppercase tracking-wider">
            {userProfile?.isBuilt ? `Domain: ${userProfile.focusDomain}` : "Domain: Not Set"}
          </p>
        </div>

        {/* Three White Bordered Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Domain */}
          <div className="bg-white border border-[#DCDAD2] rounded-xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <h3 className="text-xs text-[#5F5E5A] font-mono uppercase tracking-wider mb-2">
              Focus Domain
            </h3>
            <p className="text-xl font-mono font-semibold text-[#1C2127] h-8 truncate">
              {userProfile?.isBuilt ? userProfile.focusDomain : ""}
            </p>
          </div>

          {/* Card 2: Skills */}
          <div className="bg-white border border-[#DCDAD2] rounded-xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <h3 className="text-xs text-[#5F5E5A] font-mono uppercase tracking-wider mb-2">
              Core Skills
            </h3>
            <p className="text-xl font-mono font-semibold text-[#1C2127] h-8 truncate">
              {userProfile?.isBuilt ? userProfile.coreSkills : ""}
            </p>
          </div>

          {/* Card 3: Sessions */}
          <div className="bg-white border border-[#DCDAD2] rounded-xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <h3 className="text-xs text-[#5F5E5A] font-mono uppercase tracking-wider mb-2">
              Total Sessions
            </h3>
            <p className="text-xl font-mono font-semibold text-[#1C2127] h-8">
              
            </p>
          </div>
        </div>

        {/* Two Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-2">
          {userProfile?.isBuilt ? (
            <button
              onClick={onUploadResume}
              className="border border-[#1C2127] text-[#1C2127] px-6 py-3 rounded-lg font-semibold hover:bg-[#1C2127] hover:text-[#F4F5F2] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs"
            >
              Upload Resume
            </button>
          ) : (
            <button
              onClick={onEditProfile}
              className="border border-[#A6573F] text-[#A6573F] px-6 py-3 rounded-lg font-semibold hover:bg-[#A6573F] hover:text-[#F4F5F2] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs"
            >
              Build Profile
            </button>
          )}
          
          <button className="bg-[#A6573F] text-[#F4F5F2] px-8 py-3.5 rounded-lg font-semibold hover:bg-[#914731] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg">
            Start Practice Session →
          </button>
        </div>

        {/* Recent Sessions List Container */}
        <div className="mt-4 flex flex-col gap-4 pb-12">
          <h2 className="text-2xl font-serif text-[#1C2127] font-semibold">
            Recent Sessions
          </h2>

          {/* Single White Bordered List */}
          <div className="bg-white border border-[#DCDAD2] rounded-xl overflow-hidden shadow-xs">
            {userProfile?.isBuilt && sessions.length > 0 ? (
              <div className="divide-y divide-[#DCDAD2]">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F4F5F2]/40 transition-colors duration-150"
                  >
                    <div>
                      <h4 className="text-base font-semibold text-[#1C2127]">
                        {session.role}
                      </h4>
                      <p className="text-xs text-[#5F5E5A] mt-1 font-mono">
                        Completed on: {session.date}
                      </p>
                    </div>

                    {/* Integrity Scores colored in hardcoded inline style */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[#5F5E5A]">
                        Integrity:
                      </span>
                      <span
                        className="font-mono text-lg font-bold"
                        style={{ color: session.scoreColor }}
                      >
                        {session.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="p-10 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#DCDAD2] flex items-center justify-center">
                  <span className="text-[#DCDAD2] text-xl leading-none">—</span>
                </div>
                <p className="text-[#5F5E5A] text-sm font-mono">
                  No sessions yet. Start practicing to see your history here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
