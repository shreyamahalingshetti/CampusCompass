"use client";

import Link from "next/link";
import { College } from "@/data/colleges";
import CollegePlaceholder from "./CollegePlaceholder";

interface CollegeCompareProps {
  comparingColleges: College[];
  onRemoveCompare: (collegeId: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function CollegeCompare({
  comparingColleges,
  onRemoveCompare,
  onClearAll,
  isOpen,
  onClose,
}: CollegeCompareProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Drawer Container */}
      <div className="relative w-full max-h-[85vh] bg-surface-container-lowest border-t border-outline-variant/60 rounded-t-3xl shadow-2xl p-6 overflow-y-auto z-10 transition-all duration-300 animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/35 mb-6">
          <div>
            <h2 className="font-headline-md text-xl text-on-surface font-bold">Compare Colleges</h2>
            <p className="font-body-md text-xs text-on-surface-variant">
              Comparing {comparingColleges.length} {comparingColleges.length === 1 ? "college" : "colleges"}{" "}
              (Max 4)
            </p>
          </div>
          <div className="flex items-center gap-2">
            {comparingColleges.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-on-surface-variant hover:text-error hover:bg-error-container/10 px-3 py-1.5 rounded-lg border border-outline-variant/30 transition-all"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-surface-container-low transition-colors rounded-full text-on-surface-variant"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {comparingColleges.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-outline text-5xl mb-3 select-none">
              compare_arrows
            </span>
            <h3 className="font-headline-md text-lg text-on-surface mb-1">No colleges selected</h3>
            <p className="font-body-md text-xs text-on-surface-variant max-w-[320px]">
              Go back and click "Compare" on colleges to view side-by-side placement packages, fees, and campus statistics.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-label-md text-outline uppercase tracking-wider min-w-[150px] border-b border-outline-variant/30">
                    Feature Comparison
                  </th>
                  {comparingColleges.map((college) => (
                    <th
                      key={college.id}
                      className="py-3 px-4 text-left border-b border-outline-variant/30 min-w-[200px]"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Link href={`/college/${college.id}`}>
                            <h4 className="font-bold text-sm text-on-surface leading-tight hover:text-primary cursor-pointer transition-colors">
                              {college.shortName}
                            </h4>
                          </Link>
                          <span className="text-[10px] text-on-surface-variant">
                            {college.city}, {college.state}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveCompare(college.id)}
                          className="p-1 hover:bg-error-container/20 hover:text-error rounded-full text-on-surface-variant transition-colors"
                          title="Remove"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Image & rating */}
                <tr>
                  <td className="py-4 px-4 font-semibold text-xs text-on-surface border-b border-outline-variant/20">
                    Preview & Rating
                  </td>
                  {comparingColleges.map((college) => (
                    <td
                      key={college.id}
                      className="py-4 px-4 border-b border-outline-variant/20"
                    >
                      <div className="flex flex-col gap-2">
                        <CollegePlaceholder
                          name={college.name}
                          accredited={college.accredited}
                          className="w-full h-20 rounded-lg shadow-sm border border-outline-variant/30"
                        />
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span className="text-xs font-bold text-on-surface">{college.rating} / 5.0</span>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Avg Placement */}
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-xs text-on-surface border-b border-outline-variant/20">
                    Avg Placement Package
                  </td>
                  {comparingColleges.map((college) => (
                    <td
                      key={college.id}
                      className="py-3.5 px-4 text-sm font-bold text-primary border-b border-outline-variant/20"
                    >
                      {college.avgPlacement}
                    </td>
                  ))}
                </tr>

                {/* Highest Placement */}
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-xs text-on-surface border-b border-outline-variant/20">
                    Highest Placement Package
                  </td>
                  {comparingColleges.map((college) => (
                    <td
                      key={college.id}
                      className="py-3.5 px-4 text-sm font-bold text-on-surface border-b border-outline-variant/20"
                    >
                      {college.highestPlacement}
                    </td>
                  ))}
                </tr>

                {/* Yearly Fees */}
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-xs text-on-surface border-b border-outline-variant/20">
                    Yearly Tuition Fees
                  </td>
                  {comparingColleges.map((college) => (
                    <td
                      key={college.id}
                      className="py-3.5 px-4 text-sm font-semibold text-on-surface border-b border-outline-variant/20"
                    >
                      {college.fees}
                    </td>
                  ))}
                </tr>

                {/* Faculty Ratio */}
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-xs text-on-surface border-b border-outline-variant/20">
                    Faculty Ratio
                  </td>
                  {comparingColleges.map((college) => (
                    <td
                      key={college.id}
                      className="py-3.5 px-4 text-sm text-on-surface-variant border-b border-outline-variant/20"
                    >
                      {college.facultyRatio}
                    </td>
                  ))}
                </tr>

                {/* Accreditation */}
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-xs text-on-surface border-b border-outline-variant/20">
                    Accreditation
                  </td>
                  {comparingColleges.map((college) => (
                    <td
                      key={college.id}
                      className="py-3.5 px-4 text-xs font-semibold text-on-surface border-b border-outline-variant/20"
                    >
                      <span className="bg-primary-container/20 text-primary-fixed-dim border border-primary/10 px-2 py-0.5 rounded">
                        {college.accredited}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Courses */}
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-xs text-on-surface border-b border-outline-variant/20">
                    Popular Courses
                  </td>
                  {comparingColleges.map((college) => (
                    <td
                      key={college.id}
                      className="py-3.5 px-4 border-b border-outline-variant/20"
                    >
                      <div className="flex flex-wrap gap-1">
                        {college.courses.map((course, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] bg-surface-variant/40 text-on-surface-variant px-2 py-0.5 rounded"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
