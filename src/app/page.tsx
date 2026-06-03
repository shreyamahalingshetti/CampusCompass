"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import LoginModal from "@/components/LoginModal";
import CollegeCard from "@/components/CollegeCard";
import CollegeCompare from "@/components/CollegeCompare";
import SavedShortlist from "@/components/SavedShortlist";
import { College } from "@/data/colleges";
import { fetchColleges, getCollegesByIds, getPlatformStats } from "@/app/actions/colleges";


const SkeletonCard = () => (
  <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse">
    <div className="h-40 bg-surface-container-low rounded-xl w-full"></div>
    <div className="space-y-2">
      <div className="h-4 bg-surface-container-low rounded-md w-1/3"></div>
      <div className="h-6 bg-surface-container-low rounded-md w-3/4"></div>
      <div className="h-10 bg-surface-container-low rounded-md w-full"></div>
    </div>
    <div className="h-10 bg-surface-container-low rounded-xl w-full mt-4"></div>
  </div>
);

export default function Home() {
  const router = useRouter();

  // Navigation & UI Panel States
  const [activeTab, setActiveTab] = useState("discover");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // College List Actions States
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Pagination & Database Loading States
  const [colleges, setColleges] = useState<College[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Saved / Comparing Full Details States
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [comparingColleges, setComparingColleges] = useState<College[]>([]);

  // Application Notification State
  const [applyStatus, setApplyStatus] = useState<string | null>(null);

  // Load platform stats on mount
  const [stats, setStats] = useState({ collegesCount: 0, coursesCount: 0, usersCount: 0 });

  useEffect(() => {
    getPlatformStats()
      .then((res) => {
        setStats(res);
      })
      .catch((err) => console.error("Error loading stats:", err));
  }, []);

  // Sync login status and saved list on mount
  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");
    if (logged && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
      setIsAuthChecking(false);
    } else {
      router.push("/login");
    }
    // Restore saved list from localStorage (filter out any legacy non-cuid IDs)
    const saved = localStorage.getItem("savedIds");
    if (saved) {
      const parsed = JSON.parse(saved).filter((id: string) => id.startsWith("c"));
      setSavedIds(parsed);
      localStorage.setItem("savedIds", JSON.stringify(parsed));
    }
  }, []);


  // Fetch full details for saved and compared colleges from DB when IDs change
  useEffect(() => {
    if (savedIds.length > 0) {
      getCollegesByIds(savedIds).then((res) => {
        setSavedColleges(res);
      }).catch((err) => console.error("Error loading saved details:", err));
    } else {
      setSavedColleges([]);
    }
  }, [savedIds]);

  useEffect(() => {
    if (compareIds.length > 0) {
      getCollegesByIds(compareIds).then((res) => {
        setComparingColleges(res);
      }).catch((err) => console.error("Error loading comparison details:", err));
    } else {
      setComparingColleges([]);
    }
  }, [compareIds]);

  // Load first page of colleges with search query debouncing
  useEffect(() => {
    let active = true;
    const delayDebounceFn = setTimeout(
      async () => {
        setIsLoading(true);
        try {
          const result = await fetchColleges(searchQuery, selectedFilter, 1, 9);
          if (active) {
            setColleges(result.colleges);
            setTotalCount(result.total);
            setHasMore(result.hasMore);
            setPage(1);
          }
        } catch (error) {
          console.error("Error loading colleges:", error);
        } finally {
          if (active) {
            setIsLoading(false);
          }
        }
      },
      searchQuery ? 400 : 0
    );

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [searchQuery, selectedFilter]);

  // Load next pages of colleges
  const loadMoreColleges = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      const result = await fetchColleges(searchQuery, selectedFilter, nextPage, 9);
      setColleges((prev) => [...prev, ...result.colleges]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more colleges:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Intersection observer for automatic infinite scroll
  useEffect(() => {
    if (!hasMore || isLoading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreColleges();
        }
      },
      { threshold: 0.1 }
    );

    const target = document.getElementById("infinite-scroll-trigger");
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, isLoading, isLoadingMore, page, searchQuery, selectedFilter]);

  // Authentication Handlers
  const handleLoginSuccess = async (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
  };


  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setSavedIds([]);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("savedIds");
  };

  const handleOpenLogin = () => {
    router.push("/login");
  };

  // Saved / Bookmark Handlers — localStorage only
  const toggleSave = (collegeId: string) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setSavedIds((prev) => {
      const cleanPrev = prev.filter((id) => id.startsWith("c"));
      const next = cleanPrev.includes(collegeId)
        ? cleanPrev.filter((id) => id !== collegeId)
        : [...cleanPrev, collegeId];
      localStorage.setItem("savedIds", JSON.stringify(next));
      return next;
    });
  };


  // Compare List Handlers
  const toggleCompare = (collegeId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(collegeId)) {
        return prev.filter((id) => id !== collegeId);
      }
      if (prev.length >= 4) {
        alert("You can compare a maximum of 4 colleges side-by-side.");
        return prev;
      }
      return [...prev, collegeId];
    });
  };

  const handleRemoveCompare = (collegeId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== collegeId));
  };

  const handleClearCompare = () => {
    setCompareIds([]);
  };

  const handleRemoveSave = (collegeId: string) => {
    setSavedIds((prev) => {
      const next = prev.filter((id) => id !== collegeId);
      localStorage.setItem("savedIds", JSON.stringify(next));
      return next;
    });
  };


  // Apply Simulation
  const handleApply = (collegeName: string) => {
    setApplyStatus(`Submitting application for ${collegeName}...`);
    setTimeout(() => {
      setApplyStatus(`Successfully applied to ${collegeName}! Confirmation email sent.`);
      setTimeout(() => {
        setApplyStatus(null);
      }, 3000);
    }, 1500);
  };

  if (isAuthChecking) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <Header
        onOpenLogin={handleOpenLogin}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedIds.length}
        compareCount={compareIds.length}
      />

      {/* Main Content Area */}
      <main className="mt-16 flex-grow pb-24 text-on-background">
        
        {/* Notification Banner */}
        {applyStatus && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-primary text-on-primary px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-primary-fixed/20 animate-in fade-in slide-in-from-top duration-300">
            <span className="material-symbols-outlined text-lg animate-spin">sync</span>
            <span className="text-xs font-semibold">{applyStatus}</span>
          </div>
        )}

        {/* Dynamic Navigation Pages based on Active Bottom Tab */}
        {activeTab === "discover" && (
          <div>
            {/* Hero Section */}
            <section className="hero-gradient px-6 pt-16 pb-24 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
              <div className="absolute -left-10 bottom-0 w-64 h-64 bg-secondary-container opacity-5 rounded-full blur-3xl"></div>
              
              <h1 className="font-display-lg text-3xl md:text-5xl text-white mb-4 leading-tight max-w-2xl mx-auto">
                Find the Right College for Your Future
              </h1>
              <p className="font-body-md text-sm md:text-lg text-white/90 mb-8 max-w-[540px] mx-auto">
                Explore top universities, compare placements and tuition fees, and make informed choices.
              </p>
              
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    // Scroll to search or college list
                    document.getElementById("college-explore")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    handleOpenLogin();
                  }
                }}
                className="bg-secondary hover:bg-secondary/95 text-on-secondary-fixed font-bold px-10 py-3.5 rounded-full shadow-lg hover:shadow-secondary/20 active:scale-95 transition-all duration-200"
              >
                {isLoggedIn ? "Explore Colleges Below" : "Get Started Now"}
              </button>

              {/* Decorative Mock Dashboard graphic instead of plain external image */}
              <div className="mt-12 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-surface-container-lowest/15 backdrop-blur-md p-2">
                <div className="bg-surface-container-lowest/80 dark:bg-surface-container-lowest/90 rounded-xl overflow-hidden p-4 text-left border border-outline-variant/30 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-error"></span>
                      <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
                      <span className="w-3 h-3 rounded-full bg-primary"></span>
                    </div>
                    <div className="h-6 w-3/4 bg-primary-container/20 rounded-md"></div>
                    <div className="h-4 w-5/6 bg-on-surface-variant/10 rounded-md"></div>
                    <div className="h-4 w-2/3 bg-on-surface-variant/10 rounded-md"></div>
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="h-14 bg-surface-container-low rounded-xl border border-outline-variant/30 p-2 flex flex-col justify-between">
                        <span className="text-[9px] text-on-surface-variant font-semibold">IIT BOMBAY</span>
                        <span className="text-xs font-bold text-primary">₹2.2L/yr</span>
                      </div>
                      <div className="h-14 bg-surface-container-low rounded-xl border border-outline-variant/30 p-2 flex flex-col justify-between">
                        <span className="text-[9px] text-on-surface-variant font-semibold">IIM AHMEDABAD</span>
                        <span className="text-xs font-bold text-primary">32.7 LPA</span>
                      </div>
                      <div className="h-14 bg-surface-container-low rounded-xl border border-outline-variant/30 p-2 flex flex-col justify-between">
                        <span className="text-[9px] text-on-surface-variant font-semibold">BITS PILANI</span>
                        <span className="text-xs font-bold text-primary">60 LPA Max</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 bg-gradient-to-tr from-primary/10 to-secondary/10 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between min-h-[160px]">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-on-surface-variant">Annual Enrollment</span>
                      <span className="material-symbols-outlined text-primary">trending_up</span>
                    </div>
                    <div className="text-3xl font-extrabold text-on-surface">{stats.usersCount.toLocaleString() || "1"}</div>
                    <div className="text-[10px] text-on-surface-variant leading-normal">
                      Students registered across all accredited institutes since June 2025.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Search and Category Filter Section (Floating Overlap) */}
            <section id="college-explore" className="px-6 -mt-8 relative z-10 max-w-4xl mx-auto">
              <div className="bg-surface-container-lowest p-1.5 rounded-full shadow-lg flex items-center border border-outline-variant">
                <span className="material-symbols-outlined text-outline ml-4 select-none">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow bg-transparent border-none focus:ring-0 px-3 py-3.5 text-sm font-medium text-on-surface placeholder-outline/80"
                  placeholder="Search colleges, degrees, or cities..."
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-on-surface-variant hover:bg-surface-container-low rounded-full mr-2"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedFilter("All")}
                  className="bg-primary text-on-primary hover:brightness-110 rounded-full p-3 mr-1 transition-all"
                  title="Reset Filters"
                >
                  <span className="material-symbols-outlined select-none text-base">tune</span>
                </button>
              </div>

              {/* Tag Quick Filters */}
              <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none select-none">
                {["All", "Engineering", "Management", "Science", "Design", "High Placement", "Affordable"].map(
                  (filter) => {
                    const isSelected = selectedFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? "bg-primary text-on-primary border-primary shadow-sm"
                            : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/60 hover:bg-surface-container-low"
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  }
                )}
              </div>
            </section>

            {/* Explore Colleges Listing */}
            <section className="mt-8 px-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-headline-md text-2xl font-bold text-on-surface">Explore Colleges</h2>
                  <p className="font-body-md text-xs text-on-surface-variant">
                    Showing {colleges.length} of {totalCount} matches
                  </p>
                </div>

                {compareIds.length > 0 && (
                  <button
                    onClick={() => setIsCompareDrawerOpen(true)}
                    className="bg-primary-container text-on-primary-container hover:bg-primary-container/80 text-xs font-semibold px-4 py-2 rounded-full border border-primary/20 shadow-sm flex items-center gap-1 animate-pulse"
                  >
                    Compare Matrix ({compareIds.length})
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                )}
              </div>

              {isLoading && colleges.length === 0 ? (
                /* Premium Skeleton Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : colleges.length === 0 ? (
                <div className="py-16 text-center bg-surface-container-low/30 border border-outline-variant/40 rounded-2xl p-8">
                  <span className="material-symbols-outlined text-outline text-5xl mb-3">school</span>
                  <h3 className="font-headline-md text-lg text-on-surface mb-1">No colleges match your search</h3>
                  <p className="font-body-md text-xs text-on-surface-variant max-w-sm mx-auto">
                    Try checking your spelling, resetting the category filters, or search for broader queries like "Delhi" or "MBA".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedFilter("All");
                    }}
                    className="mt-4 text-xs font-bold text-primary hover:underline"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {colleges.map((college) => (
                      <CollegeCard
                        key={college.id}
                        college={college}
                        isSaved={savedIds.includes(college.id)}
                        isComparing={compareIds.includes(college.id)}
                        onToggleSave={() => toggleSave(college.id)}
                        onToggleCompare={() => toggleCompare(college.id)}
                      />
                    ))}
                  </div>

                  {/* Infinite Scroll Trigger and Loader */}
                  <div id="infinite-scroll-trigger" className="pt-6 pb-12 flex flex-col items-center justify-center">
                    {isLoadingMore ? (
                      <div className="flex flex-col items-center gap-2 text-primary">
                        <span className="material-symbols-outlined animate-spin text-3xl">sync</span>
                        <span className="text-[10px] font-semibold tracking-wider uppercase">Loading more premium campuses...</span>
                      </div>
                    ) : hasMore ? (
                      <button
                        onClick={loadMoreColleges}
                        className="bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary border border-primary/20 hover:border-transparent px-8 py-3 rounded-full text-xs font-bold shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
                      >
                        Load More Colleges
                      </button>
                    ) : (
                      <p className="text-[10px] text-outline font-semibold tracking-wide uppercase">
                        Reached the end of accredited listings ({totalCount} total)
                      </p>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Statistics Section */}
            <section className="mt-16 px-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-container-low/60 hover:bg-surface-container-low transition-all duration-300 p-6 rounded-2xl border border-outline-variant/40 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-2xl font-bold text-primary">{stats.collegesCount}</h3>
                    <p className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant">Accredited Colleges</p>
                  </div>
                </div>
                
                <div className="bg-surface-container-low/60 hover:bg-surface-container-low transition-all duration-300 p-6 rounded-2xl border border-outline-variant/40 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">groups</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-2xl font-bold text-primary">{stats.usersCount}</h3>
                    <p className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant">Students Guided</p>
                  </div>
                </div>
                
                <div className="bg-surface-container-low/60 hover:bg-surface-container-low transition-all duration-300 p-6 rounded-2xl border border-outline-variant/40 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-2xl font-bold text-primary">{stats.coursesCount}</h3>
                    <p className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant">Specialized Degrees</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Feature Highlights */}
            <section className="mt-16 px-6 max-w-5xl mx-auto">
              <h2 className="font-headline-md text-2xl font-bold text-on-surface mb-6 text-center">
                Our Key Platform Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature Card 1 */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 shadow-sm flex flex-col gap-3 hover:border-primary/30 transition-all duration-200">
                  <span className="material-symbols-outlined text-primary text-4xl select-none">
                    search_spark
                  </span>
                  <h4 className="font-headline-md text-lg font-bold text-on-surface">Smart Search</h4>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    Advanced filters to parse colleges matching your budget limits, placement expectations, and branch preferences.
                  </p>
                </div>
                {/* Feature Card 2 */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 shadow-sm flex flex-col gap-3 hover:border-primary/30 transition-all duration-200">
                  <span className="material-symbols-outlined text-primary text-4xl select-none">
                    compare_arrows
                  </span>
                  <h4 className="font-headline-md text-lg font-bold text-on-surface">Compare Colleges</h4>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    Side-by-side matrices of tuition costs, student-faculty ratios, and average/highest placement statistics.
                  </p>
                </div>
                {/* Feature Card 3 */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 shadow-sm flex flex-col gap-3 hover:border-primary/30 transition-all duration-200">
                  <span className="material-symbols-outlined text-primary text-4xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bookmark
                  </span>
                  <h4 className="font-headline-md text-lg font-bold text-on-surface">Save Favorites</h4>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    Build your custom shortlist, apply to multiple colleges with one click, and receive application deadline notices.
                  </p>
                </div>
              </div>
            </section>

            {/* Visual Divider */}
            <div className="h-0.5 bg-outline-variant/20 mx-6 my-16 rounded-full max-w-4xl md:mx-auto"></div>

            {/* Final CTA Section */}
            <section className="px-6 mb-16 max-w-4xl mx-auto">
              <div className="bg-primary p-8 md:p-12 rounded-3xl text-center shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-16 -mt-16 blur-2xl"></div>
                <h2 className="font-headline-lg-mobile text-2xl md:text-3xl text-on-primary font-bold mb-3 max-w-[480px] mx-auto">
                  Ready to start your journey?
                </h2>
                <p className="font-body-md text-xs md:text-sm text-on-primary/80 mb-8 max-w-[320px] md:max-w-[400px] mx-auto">
                  Join thousands of students who found their target colleges through CampusCompass.
                </p>
                
                {isLoggedIn ? (
                  <div className="max-w-[320px] mx-auto bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl text-on-primary">
                    <p className="text-xs font-semibold">You are logged in as {userEmail}</p>
                    <p className="text-[10px] text-white/70 mt-1">Explore and shortlist colleges to apply directly!</p>
                  </div>
                ) : (
                  <button
                    onClick={handleOpenLogin}
                    className="w-full sm:w-auto bg-secondary hover:bg-secondary/95 text-on-secondary-fixed font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-secondary/20 active:scale-95 transition-transform"
                  >
                    Create Free Account
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === "saved" && (
          <div className="px-6 max-w-4xl mx-auto pt-8">
            <SavedShortlist
              savedColleges={savedColleges}
              onRemoveSave={handleRemoveSave}
              isOpen={true}
              onClose={() => setActiveTab("discover")}
              onApply={handleApply}
            />
          </div>
        )}

        {activeTab === "compare" && (
          <div className="px-6 max-w-6xl mx-auto pt-8">
            <CollegeCompare
              comparingColleges={comparingColleges}
              onRemoveCompare={handleRemoveCompare}
              onClearAll={handleClearCompare}
              isOpen={true}
              onClose={() => setActiveTab("discover")}
            />
          </div>
        )}

        {activeTab === "profile" && (
          <div className="px-6 max-w-[420px] mx-auto pt-12">
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-8 shadow-xl text-center">
              {isLoggedIn ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-primary text-on-primary rounded-full font-bold text-3xl flex items-center justify-center mx-auto shadow-md">
                    {userEmail?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-headline-md text-2xl font-bold text-on-surface">My Account</h2>
                    <p className="font-body-md text-sm text-on-surface-variant mt-1">{userEmail}</p>
                  </div>

                  <div className="border-t border-outline-variant/40 pt-4 text-left space-y-3">
                    <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                      <span>Saved Colleges</span>
                      <span className="text-on-surface">{savedIds.length}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                      <span>Colleges in Compare</span>
                      <span className="text-on-surface">{compareIds.length}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                      <span>Account Status</span>
                      <span className="text-primary">Active Member</span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-3 border border-error text-error hover:bg-error-container/10 font-label-md rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="py-8 space-y-4">
                  <span className="material-symbols-outlined text-outline text-6xl">account_circle</span>
                  <h2 className="font-headline-md text-xl font-bold text-on-surface">Not Logged In</h2>
                  <p className="font-body-md text-xs text-on-surface-variant max-w-[320px] mx-auto">
                    Sign in to CampusCompass to save college bookmarks, compare details, and check your application logs.
                  </p>
                  <button
                    onClick={handleOpenLogin}
                    className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md shadow-md active:scale-95 hover:brightness-110 transition-all"
                  >
                    Sign In to Your Account
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer (only on discover page to avoid overlapping drawer content) */}
      {activeTab === "discover" && (
        <footer className="bg-inverse-surface py-12 px-6 text-center text-inverse-on-surface">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4 select-none">
              <span className="material-symbols-outlined text-surface-container-lowest" style={{ fontSize: "24px" }}>
                school
              </span>
              <span className="font-headline-md text-lg font-bold text-inverse-on-surface">
                CampusCompass
              </span>
            </div>
            <p className="font-body-md text-xs text-surface-variant/80 mb-6">
              © {new Date().getFullYear()} CampusCompass. Enlightened Progress.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-8 text-xs font-semibold">
              <a href="#" className="text-surface-variant hover:text-secondary transition-colors">
                About Us
              </a>
              <a href="#" className="text-surface-variant hover:text-secondary transition-colors">
                Research
              </a>
              <a href="#" className="text-surface-variant hover:text-secondary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-surface-variant hover:text-secondary transition-colors">
                Contact Support
              </a>
            </div>
            <div className="flex justify-center gap-4">
              <div className="w-10 h-10 rounded-full border border-outline-variant/35 flex items-center justify-center text-surface-variant hover:text-on-primary hover:border-on-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">share</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-outline-variant/35 flex items-center justify-center text-surface-variant hover:text-on-primary hover:border-on-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">public</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Bottom Floating Nav Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedIds.length}
        compareCount={compareIds.length}
        onOpenLogin={handleOpenLogin}
        isLoggedIn={isLoggedIn}
      />

      {/* Auth Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Slide up Comparison Drawer */}
      <CollegeCompare
        comparingColleges={comparingColleges}
        onRemoveCompare={handleRemoveCompare}
        onClearAll={handleClearCompare}
        isOpen={isCompareDrawerOpen}
        onClose={() => setIsCompareDrawerOpen(false)}
      />

      {/* Slide up Saved drawer */}
      <SavedShortlist
        savedColleges={savedColleges}
        onRemoveSave={handleRemoveSave}
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        onApply={handleApply}
      />
    </div>
  );
}
