"use client";

import Link from "next/link";
import { College } from "@/data/colleges";
import CollegePlaceholder from "./CollegePlaceholder";

interface CollegeCardProps {
  college: College;
  isSaved: boolean;
  isComparing: boolean;
  onToggleSave: () => void;
  onToggleCompare: () => void;
}

export default function CollegeCard({
  college,
  isSaved,
  isComparing,
  onToggleSave,
  onToggleCompare,
}: CollegeCardProps) {
  return (
    <div className="bg-surface-container-lowest text-on-surface border border-outline-variant/65 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Image container */}
      <div className="relative h-44 overflow-hidden">
        <CollegePlaceholder
          name={college.name}
          accredited={college.accredited}
          className="group-hover:scale-105 transition-transform duration-500"
        />
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm border border-outline-variant/50 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-secondary text-base select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <span className="text-xs font-bold text-on-surface">{college.rating}</span>
        </div>

        {/* Save/Favorite button */}
        <button
          onClick={onToggleSave}
          className="absolute top-3 right-3 w-8.5 h-8.5 rounded-full bg-surface/95 backdrop-blur-sm border border-outline-variant/50 flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-all shadow-sm"
          title={isSaved ? "Remove from Shortlist" : "Save College"}
        >
          <span
            className="material-symbols-outlined text-lg select-none"
            style={{ fontVariationSettings: `"FILL" ${isSaved ? 1 : 0}, "wght" 450` }}
          >
            bookmark
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Location & Accreditation */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs text-on-surface-variant flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs select-none">location_on</span>
              {college.city}, {college.state}
            </span>
            <span className="text-[10px] bg-primary-container/20 text-primary-fixed-dim border border-primary/10 px-2 py-0.5 rounded font-semibold select-none">
              {college.accredited}
            </span>
          </div>

          {/* Name */}
          <Link href={`/college/${college.id}`}>
            <h3 className="font-headline-md text-[19px] leading-snug font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1 cursor-pointer">
              {college.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="font-body-md text-xs text-on-surface-variant mb-4 line-clamp-2 leading-relaxed">
            {college.description}
          </p>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/20">
            <div>
              <p className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">
                Average Package
              </p>
              <p className="text-sm font-bold text-primary">{college.avgPlacement}</p>
            </div>
            <div>
              <p className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">
                Yearly Fees
              </p>
              <p className="text-sm font-bold text-on-surface">{college.fees}</p>
            </div>
          </div>

          {/* Courses preview */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {college.courses.slice(0, 2).map((course, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-surface-variant/40 text-on-surface-variant px-2.5 py-0.5 rounded-full"
              >
                {course}
              </span>
            ))}
            {college.courses.length > 2 && (
              <span className="text-[9px] text-outline font-semibold self-center ml-0.5">
                +{college.courses.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Compare action button */}
        <button
          onClick={onToggleCompare}
          className={`w-full py-2 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
            isComparing
              ? "bg-primary text-on-primary border-primary"
              : "border-outline-variant hover:bg-surface-container-low text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-base select-none">
            {isComparing ? "check" : "compare_arrows"}
          </span>
          {isComparing ? "Added to Compare" : "Compare College"}
        </button>
      </div>
    </div>
  );
}
