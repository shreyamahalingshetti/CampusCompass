"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import CollegePlaceholder from "@/components/CollegePlaceholder";

interface CollegeDetailClientProps {
  college: {
    id: string;
    name: string;
    shortName: string;
    city: string;
    state: string;
    rating: number;
    fees: string;
    feesNum: number;
    avgPlacement: string;
    avgPlacementNum: number;
    highestPlacement: string;
    courses: string[];
    description: string;
    accredited: string;
    facultyRatio: string;
    establishedYear: number;
    website: string;
    nirfRank: number;
    nirfScore: number;
    fullCourses: Array<{
      id: string;
      name: string;
      duration: string;
      degreeType: string;
    }>;
    reviews: Array<{
      id: string;
      userName: string;
      rating: number;
      comment: string;
      createdAt: string;
    }>;
  };
}

export default function CollegeDetailClient({ college }: CollegeDetailClientProps) {
  const router = useRouter();

  // Navigation & Active Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">("overview");

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // College List Actions States
  const [isSaved, setIsSaved] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  // Application Notification State
  const [applyStatus, setApplyStatus] = useState<string | null>(null);

  // Sync auth and saved state on mount
  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");
    if (logged && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }

    // Check if this college is saved in localStorage
    const localSaved = localStorage.getItem("savedIds");
    if (localSaved) {
      const savedArr = JSON.parse(localSaved);
      setIsSaved(savedArr.includes(college.id));
    }

    // Check if this college is in the compare list
    const localCompare = localStorage.getItem("compareIds");
    if (localCompare) {
      const compareArr = JSON.parse(localCompare);
      setIsComparing(compareArr.includes(college.id));
    }
  }, [college.id]);


  // Saved / Bookmark Handler — localStorage only
  const handleToggleSave = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    const localSaved = localStorage.getItem("savedIds");
    let savedArr: string[] = localSaved ? JSON.parse(localSaved) : [];
    if (nextSavedState) {
      if (!savedArr.includes(college.id)) savedArr.push(college.id);
    } else {
      savedArr = savedArr.filter((id) => id !== college.id);
    }
    localStorage.setItem("savedIds", JSON.stringify(savedArr));
  };


  // Compare Handler
  const handleToggleCompare = () => {
    const localCompare = localStorage.getItem("compareIds");
    let compareArr: string[] = [];
    if (localCompare) {
      compareArr = JSON.parse(localCompare);
    }

    const nextCompareState = !isComparing;

    if (nextCompareState) {
      if (compareArr.length >= 4) {
        alert("You can compare a maximum of 4 colleges side-by-side.");
        return;
      }
      if (!compareArr.includes(college.id)) compareArr.push(college.id);
    } else {
      compareArr = compareArr.filter((id) => id !== college.id);
    }

    setIsComparing(nextCompareState);
    localStorage.setItem("compareIds", JSON.stringify(compareArr));
  };

  // Redirect to official website/admission portal
  const handleApply = () => {
    if (college.website) {
      window.open(college.website, "_blank", "noopener,noreferrer");
    }
  };

  // Generate Recruiters List based on college category
  const isEngineering =
    college.name.toLowerCase().includes("technology") ||
    college.name.toLowerCase().includes("iit") ||
    college.name.toLowerCase().includes("nit") ||
    college.name.toLowerCase().includes("iiit") ||
    college.name.toLowerCase().includes("engineering") ||
    college.name.toLowerCase().includes("science");

  const isManagement =
    college.name.toLowerCase().includes("management") ||
    college.name.toLowerCase().includes("iim");

  const isDesign =
    college.name.toLowerCase().includes("design") ||
    college.name.toLowerCase().includes("nid");

  let recruiters = ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "HCL Tech"];
  if (isEngineering) {
    recruiters = ["Google", "Microsoft", "Amazon", "Adobe", "NVIDIA", "Intel", "Qualcomm", "Oracle", "Cisco"];
  } else if (isManagement) {
    recruiters = [
      "McKinsey & Co.",
      "Boston Consulting Group (BCG)",
      "Bain & Company",
      "Goldman Sachs",
      "Morgan Stanley",
      "J.P. Morgan",
      "Deloitte",
      "EY",
      "PwC"
    ];
  } else if (isDesign) {
    recruiters = [
      "TCS Design",
      "Tata Motors",
      "Samsung Design",
      "Landor & Fitch",
      "Elephant Design",
      "Microsoft UX",
      "Cognizant",
      "Wipro Design"
    ];
  }

  // Estimated Placement Rate & Recruiters Count
  const placementRate = Math.round(98 - (college.nirfRank ? (college.nirfRank - 1) * 0.25 : 5));
  const totalRecruitersCount = Math.round(250 - (college.nirfRank ? (college.nirfRank - 1) * 3 : 50));

  // Reviews Data List from DB
  const reviews = college.reviews || [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background pb-20 md:pb-0">
      
      {/* Floating Status Notification */}
      {applyStatus && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-primary text-on-primary px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-primary-fixed/20 animate-in fade-in slide-in-from-top duration-300">
          <span className="material-symbols-outlined text-lg animate-spin">sync</span>
          <span className="text-xs font-semibold">{applyStatus}</span>
        </div>
      )}

      {/* Dynamic Subpage Header */}
      <header className="sticky top-0 w-full z-40 bg-surface/90 backdrop-blur-md text-on-surface border-b border-outline-variant/35 px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group select-none font-semibold text-sm"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          Back to Discovery
        </Link>
        <span className="font-headline-lg-mobile text-base font-bold text-primary select-none">
          CampusCompass
        </span>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-grow">
        
        {/* College Hero Section */}
        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl overflow-hidden shadow-sm mb-6 flex flex-col md:flex-row gap-6 p-4 sm:p-6">
          <CollegePlaceholder
            name={college.name}
            accredited={college.accredited}
            size="lg"
            className="md:w-[400px] h-64 md:h-auto rounded-2xl flex-shrink-0"
          />
          
          <div className="flex flex-col justify-between flex-grow">
            <div>
              {/* Badges / Location Row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  NIRF Rank #{college.nirfRank}
                </span>
                <span className="bg-surface-variant/50 text-on-surface-variant text-[10px] font-semibold px-3 py-1 rounded-full flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs select-none">location_on</span>
                  {college.city}, {college.state}
                </span>
                <span className="bg-secondary/15 text-secondary border border-secondary/20 text-[10px] font-bold px-3 py-1 rounded-full">
                  Established {college.establishedYear}
                </span>
              </div>

              {/* College Full Title */}
              <h1 
                className="font-headline-lg text-2xl sm:text-4xl font-extrabold text-on-surface mb-3 leading-tight"
                style={{ fontFamily: "var(--font-literata), serif" }}
              >
                {college.name}
              </h1>

              {/* Rating & Short Info */}
              <div className="flex items-center gap-4 mb-4 select-none">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="text-sm font-bold text-on-surface">{college.rating}</span>
                  <span className="text-xs text-on-surface-variant">(Verified Students)</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/55"></span>
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  Visit Website
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface-container-low/60 rounded-2xl border border-outline-variant/20">
              <div>
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">NIRF Score</p>
                <p className="text-base font-bold text-on-surface">{college.nirfScore} / 100</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Avg Package</p>
                <p className="text-base font-bold text-primary">{college.avgPlacement}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Yearly Fees</p>
                <p className="text-base font-bold text-on-surface">{college.fees}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Faculty Ratio</p>
                <p className="text-base font-bold text-on-surface">{college.facultyRatio}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Details Page Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Content Area (Spans 2 Columns on Desktop) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs Header Navigation */}
            <div className="flex border-b border-outline-variant/35 bg-surface-container-lowest rounded-2xl p-1.5 shadow-sm overflow-x-auto scrollbar-none select-none">
              {(["overview", "courses", "placements", "reviews"] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl capitalize tracking-wide transition-all whitespace-nowrap cursor-pointer px-4 ${
                      isActive
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Tab Panel Content Box */}
            <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[350px]">
              
              {/* Tab 1: Overview Panel */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-xl">description</span>
                      About the Institution
                    </h2>
                    <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                      {college.description}
                    </p>
                  </div>

                  <div className="h-0.5 bg-outline-variant/15 rounded-full" />

                  <div>
                    <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-xl">info</span>
                      Key Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center p-3 bg-surface-container-low/50 border border-outline-variant/30 rounded-xl">
                        <span className="text-xs text-on-surface-variant font-semibold">Established Year</span>
                        <span className="text-xs font-bold text-on-surface">{college.establishedYear}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-surface-container-low/50 border border-outline-variant/30 rounded-xl">
                        <span className="text-xs text-on-surface-variant font-semibold">Affiliation / Status</span>
                        <span className="text-xs font-bold text-on-surface">Institute of National Importance</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-surface-container-low/50 border border-outline-variant/30 rounded-xl">
                        <span className="text-xs text-on-surface-variant font-semibold">Website Portal</span>
                        <a
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
                        >
                          {college.website.replace("https://", "")}
                          <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                        </a>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-surface-container-low/50 border border-outline-variant/30 rounded-xl">
                        <span className="text-xs text-on-surface-variant font-semibold">Student-Faculty Ratio</span>
                        <span className="text-xs font-bold text-on-surface">{college.facultyRatio}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Courses Panel */}
              {activeTab === "courses" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-lg font-bold text-on-surface mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-xl">menu_book</span>
                      Offered Degrees & Specializations
                    </h2>
                    <p className="text-xs text-on-surface-variant mb-4">
                      Explore detailed curricula, seats, and intake eligibility options.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {college.fullCourses.map((course) => (
                        <div
                          key={course.id}
                          className="p-4 bg-surface-container-low/50 border border-outline-variant/30 hover:border-primary/25 rounded-2xl hover:bg-surface-container-low transition-colors"
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-bold text-xs sm:text-sm text-on-surface leading-tight">
                              {course.name}
                            </h3>
                            <span className="bg-primary/10 text-primary border border-primary/10 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                              {course.degreeType}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-[10px] font-semibold text-on-surface-variant pt-2 border-t border-outline-variant/15">
                            <span className="flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-xs select-none">schedule</span>
                              {course.duration}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/60"></span>
                            <span className="flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-xs select-none">groups</span>
                              120 Seats
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Placements Panel */}
              {activeTab === "placements" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-xl">trending_up</span>
                      Placement Highlights
                    </h2>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-primary-container/20 border border-primary/10 rounded-2xl text-center">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">Average package</span>
                        <span className="text-lg font-extrabold text-primary">{college.avgPlacement}</span>
                      </div>
                      <div className="p-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-center">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Highest package</span>
                        <span className="text-lg font-extrabold text-on-surface">{college.highestPlacement}</span>
                      </div>
                      <div className="p-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-center">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Placement Rate</span>
                        <span className="text-lg font-extrabold text-on-surface">{placementRate}%</span>
                      </div>
                      <div className="p-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-center">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Recruiters Visited</span>
                        <span className="text-lg font-extrabold text-on-surface">{totalRecruitersCount}+</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-0.5 bg-outline-variant/15 rounded-full" />

                  <div>
                    <h2 className="text-base font-bold text-on-surface mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-lg">corporate_fare</span>
                      Top Recruiting Partners
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {recruiters.map((recruiter, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-2 bg-surface-container-low border border-outline-variant/40 hover:border-primary/20 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                          {recruiter}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-0.5 bg-outline-variant/15 rounded-full" />

                  <div>
                    <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Career Development Cell (CDC)</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      The campus placements are coordinated by the dedicated CDC department. CDC manages resume shortlists, mockup technical interview rounds, soft-skills training seminars, and coordinates company interview visits starting early September of every academic session.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 4: Reviews Panel */}
              {activeTab === "reviews" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Reviews Summary Stats */}
                  <div className="flex flex-col md:flex-row items-center gap-6 p-5 bg-surface-container-low/50 border border-outline-variant/35 rounded-2xl">
                    <div className="text-center md:border-r border-outline-variant/30 md:pr-8 flex-shrink-0">
                      <span className="text-4xl font-extrabold text-on-surface">{college.rating}</span>
                      <span className="text-sm font-semibold text-outline block mt-0.5">out of 5.0</span>
                      <div className="flex items-center gap-0.5 justify-center mt-1.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-base select-none"
                            style={{ fontVariationSettings: `FILL ${i < Math.floor(college.rating) ? 1 : 0}` }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress bars */}
                    <div className="flex-grow w-full space-y-2.5">
                      {[
                        { label: "Academics", score: 4.8 },
                        { label: "Infrastructure", score: 4.6 },
                        { label: "Placements", score: 4.9 },
                        { label: "Campus Life", score: 4.5 }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4 text-xs font-semibold">
                          <span className="text-on-surface-variant w-24 text-left">{item.label}</span>
                          <div className="flex-grow h-2 bg-outline-variant/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${(item.score / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-on-surface text-right w-8">{item.score.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Student reviews list */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider pt-2">Verified Student Logs</h3>
                    
                    {reviews.map((review, idx) => {
                      const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      });
                      const courseName = college.courses[idx % college.courses.length] || "Alumni";
                      const tags = ["Academic Excellence", "Green Campus", "Industry Exposure", "Vibrant Life", "Great Placements"];
                      const tag = tags[idx % tags.length];

                      return (
                        <div
                          key={review.id || idx}
                          className="p-5 border border-outline-variant/35 bg-surface-container-low/20 rounded-2xl space-y-3"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="font-bold text-sm text-on-surface">{review.userName}</h4>
                              <p className="text-[10px] text-on-surface-variant font-semibold">
                                {courseName} • {formattedDate}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              <span className="bg-primary/10 text-primary border border-primary/10 text-[9px] font-bold px-2 py-0.5 rounded-md">
                                {tag}
                              </span>
                              <span className="bg-surface/90 border border-outline-variant/40 px-2 py-0.5 rounded-full text-xs font-bold text-on-surface flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-xs text-amber-500 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                {review.rating}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs leading-relaxed text-on-surface-variant font-medium">
                            "{review.comment}"
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Widget (Spans 1 Column on Desktop) */}
          <div className="space-y-6">
            
            {/* Quick Actions Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider border-b border-outline-variant/20 pb-3 mb-2 select-none">
                Admission Portal
              </h3>

              {/* Price / Package highlights */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant font-semibold">Tuition Fees</span>
                  <span className="text-sm font-extrabold text-on-surface">{college.fees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant font-semibold">Average Package</span>
                  <span className="text-sm font-extrabold text-primary">{college.avgPlacement}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant font-semibold">Admission Channel</span>
                  <span className="text-xs bg-surface-variant/40 text-on-surface-variant px-2.5 py-0.5 rounded font-bold">
                    {isEngineering ? "JEE Mains / GATE" : isManagement ? "CAT / GMAT" : "Entrance Test"}
                  </span>
                </div>
              </div>

              {/* Primary Apply Button */}
              <button
                onClick={handleApply}
                className="w-full py-3.5 bg-primary text-on-primary hover:brightness-110 active:scale-95 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-xs tracking-wider cursor-pointer"
              >
                APPLY FOR ADMISSION
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Save/Favorite button */}
                <button
                  onClick={handleToggleSave}
                  className={`py-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isSaved
                      ? "bg-primary-container text-on-primary-container border-primary/20"
                      : "border-outline-variant hover:bg-surface-container-low text-on-surface cursor-pointer"
                  }`}
                  title={isSaved ? "Remove Bookmark" : "Save to Shortlist"}
                >
                  <span
                    className="material-symbols-outlined text-base select-none"
                    style={{ fontVariationSettings: `"FILL" ${isSaved ? 1 : 0}` }}
                  >
                    bookmark
                  </span>
                  {isSaved ? "Saved" : "Save"}
                </button>

                {/* Compare toggle button */}
                <button
                  onClick={handleToggleCompare}
                  className={`py-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isComparing
                      ? "bg-primary text-on-primary border-primary"
                      : "border-outline-variant hover:bg-surface-container-low text-on-surface cursor-pointer"
                  }`}
                >
                  <span className="material-symbols-outlined text-base select-none">
                    {isComparing ? "check" : "compare_arrows"}
                  </span>
                  {isComparing ? "Comparing" : "Compare"}
                </button>
              </div>
            </div>

            {/* Quick Campus Info Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider border-b border-outline-variant/20 pb-3 select-none">
                Accreditation info
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">verified</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">NIRF National Rank #{college.nirfRank}</p>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      Ranked by Ministry of Education, Government of India.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">military_tech</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">NIRF Score {college.nirfScore} / 100</p>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      Scored based on teaching metrics, research output, graduation details, and outreach scores.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Navigation Bar on Mobile Screens for easy Apply actions */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-outline-variant/40 p-3 shadow-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleSave}
            className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
              isSaved
                ? "bg-primary-container text-on-primary-container border-primary/20"
                : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span
              className="material-symbols-outlined text-lg select-none"
              style={{ fontVariationSettings: `"FILL" ${isSaved ? 1 : 0}` }}
            >
              bookmark
            </span>
          </button>
          
          <button
            onClick={handleToggleCompare}
            className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
              isComparing
                ? "bg-primary text-on-primary border-primary"
                : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-lg select-none">
              {isComparing ? "check" : "compare_arrows"}
            </span>
          </button>
        </div>

        <button
          onClick={handleApply}
          className="flex-grow py-3 bg-primary text-on-primary hover:brightness-110 active:scale-95 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
        >
          APPLY NOW
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
