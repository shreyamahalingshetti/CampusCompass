"use client";

import { useEffect, useState } from "react";

interface HeaderProps {
  onOpenLogin: () => void;
  isLoggedIn: boolean;
  userEmail: string | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  compareCount: number;
}

export default function Header({
  onOpenLogin,
  isLoggedIn,
  userEmail,
  onLogout,
  activeTab,
  setActiveTab,
  savedCount,
  compareCount,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Check scroll state
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Initial dark mode check
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const getInitials = (email: string) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md text-on-surface flex justify-between items-center px-6 h-16 transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm border-b border-outline-variant/30"
      }`}
    >
      {/* Brand logo & name */}
      <div
        onClick={() => setActiveTab("discover")}
        className="flex items-center gap-2 select-none cursor-pointer group"
      >
        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform" style={{ fontSize: "28px" }}>
          school
        </span>
        <span className="font-headline-lg-mobile text-xl font-bold text-primary tracking-tight">
          CampusCompass
        </span>
      </div>

      {/* Center - Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold select-none">
        <button
          onClick={() => setActiveTab("discover")}
          className={`transition-all py-1.5 px-3 rounded-xl cursor-pointer ${
            activeTab === "discover"
              ? "text-primary bg-primary-container/40"
              : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => {
            if (!isLoggedIn) {
              onOpenLogin();
            } else {
              setActiveTab("saved");
            }
          }}
          className={`transition-all py-1.5 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer ${
            activeTab === "saved"
              ? "text-primary bg-primary-container/40"
              : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
          }`}
        >
          Saved
          {savedCount > 0 && (
            <span className="bg-primary text-on-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {savedCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("compare")}
          className={`transition-all py-1.5 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer ${
            activeTab === "compare"
              ? "text-primary bg-primary-container/40"
              : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
          }`}
        >
          Compare
          {compareCount > 0 && (
            <span className="bg-primary text-on-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {compareCount}
            </span>
          )}
        </button>
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Dark mode button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-surface-container-low transition-all duration-200 rounded-full text-on-surface-variant hover:text-primary active:scale-90"
          title="Toggle Dark Mode"
        >
          <span className="material-symbols-outlined select-none">
            {isDarkMode ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* Profile / Account Area */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center hover:opacity-90 active:scale-95 transition-transform"
            >
              {getInitials(userEmail || "")}
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-outline-variant/50">
                  <p className="text-xs text-on-surface-variant font-label-sm truncate">Logged in as</p>
                  <p className="text-sm font-semibold text-on-surface truncate">{userEmail}</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">account_circle</span>
                  View Profile
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-surface-container-low transition-colors flex items-center gap-2 border-t border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-on-primary active:scale-95 transition-all duration-200 text-sm font-medium"
          >
            <span className="material-symbols-outlined text-lg">account_circle</span>
            Login
          </button>
        )}
      </div>
    </header>
  );
}
