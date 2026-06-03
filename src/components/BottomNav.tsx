"use client";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  compareCount: number;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

export default function BottomNav({
  activeTab,
  setActiveTab,
  savedCount,
  compareCount,
  onOpenLogin,
  isLoggedIn,
}: BottomNavProps) {
  const tabs = [
    { id: "discover", label: "Discover", icon: "explore", iconFilled: "explore" },
    { id: "saved", label: "Saved", icon: "bookmark", iconFilled: "bookmark", badge: savedCount },
    { id: "compare", label: "Compare", icon: "compare_arrows", iconFilled: "compare_arrows", badge: compareCount },
    { id: "profile", label: "Profile", icon: "account_circle", iconFilled: "account_circle" },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === "profile" && !isLoggedIn) {
      onOpenLogin();
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-2.5 bg-surface-container-high/95 backdrop-blur-md text-on-surface shadow-[0_-4px_16px_rgba(0,0,0,0.06)] border-t border-outline-variant/35 rounded-t-2xl md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:max-w-[480px] md:rounded-full md:border md:shadow-xl md:px-6 transition-all duration-300">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-4.5 rounded-full active:scale-95 transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-secondary text-on-secondary-fixed font-semibold shadow-sm"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low/50"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: `"FILL" ${isActive ? 1 : 0}, "wght" 400`,
                fontSize: "22px",
              }}
            >
              {isActive ? tab.iconFilled : tab.icon}
            </span>
            <span className="font-label-sm text-[10px] mt-0.5">{tab.label}</span>

            {/* Badges for Saved / Compare */}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="absolute -top-1.5 right-1 bg-primary text-on-primary text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold border border-surface shadow-sm">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
