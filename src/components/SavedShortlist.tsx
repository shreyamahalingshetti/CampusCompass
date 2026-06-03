"use client";

import Link from "next/link";
import { College } from "@/data/colleges";
import CollegePlaceholder from "./CollegePlaceholder";

interface SavedShortlistProps {
  savedColleges: College[];
  onRemoveSave: (collegeId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onApply: (collegeName: string) => void;
}

export default function SavedShortlist({
  savedColleges,
  onRemoveSave,
  isOpen,
  onClose,
  onApply,
}: SavedShortlistProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Drawer Container */}
      <div className="relative w-full max-h-[80vh] bg-surface-container-lowest border-t border-outline-variant/60 rounded-t-3xl shadow-2xl p-6 overflow-y-auto z-10 transition-all duration-300 animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/35 mb-6">
          <div>
            <h2 className="font-headline-md text-xl text-on-surface font-bold">My Saved Shortlist</h2>
            <p className="font-body-md text-xs text-on-surface-variant">
              You have {savedColleges.length} {savedColleges.length === 1 ? "college" : "colleges"} saved
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-container-low transition-colors rounded-full text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* List of saved colleges */}
        {savedColleges.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-outline text-5xl mb-3 select-none" style={{ fontVariationSettings: "'FILL' 0" }}>
              bookmark
            </span>
            <h3 className="font-headline-md text-lg text-on-surface mb-1">Your shortlist is empty</h3>
            <p className="font-body-md text-xs text-on-surface-variant max-w-[320px]">
              Explore available universities and tap the bookmark icon to save colleges for future comparisons or applications.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedColleges.map((college) => (
              <div
                key={college.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-surface-container-low/50 border border-outline-variant/40 rounded-2xl hover:border-primary/45 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <CollegePlaceholder
                    name={college.name}
                    accredited={college.accredited}
                    size="sm"
                    className="w-16 h-16 rounded-xl border border-outline-variant/30 flex-shrink-0"
                  />
                  <div>
                    <Link href={`/college/${college.id}`}>
                      <h3 className="font-bold text-sm text-on-surface leading-snug hover:text-primary transition-colors cursor-pointer">
                        {college.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-on-surface-variant flex items-center gap-0.5 mt-0.5">
                      <span className="material-symbols-outlined text-xs select-none">location_on</span>
                      {college.city}, {college.state}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] font-semibold text-primary">
                      <span>Avg: {college.avgPlacement}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/50"></span>
                      <span className="text-on-surface-variant">Fees: {college.fees}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                  <button
                    onClick={() => onRemoveSave(college.id)}
                    className="p-2 hover:bg-error-container/10 text-on-surface-variant hover:text-error rounded-xl transition-all border border-transparent hover:border-error/15"
                    title="Remove"
                  >
                    <span className="material-symbols-outlined text-lg select-none">delete</span>
                  </button>
                  <button
                    onClick={() => onApply(college.name)}
                    className="flex-grow sm:flex-grow-0 px-5 py-2 bg-primary text-on-primary hover:brightness-110 active:scale-95 text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1"
                  >
                    Apply Now
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
