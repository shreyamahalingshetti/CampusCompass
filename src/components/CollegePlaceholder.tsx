"use client";

import React from "react";

interface CollegePlaceholderProps {
  name: string;
  accredited: string; // e.g. "NIRF Rank #1"
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Robust initials extraction helper
export function getCollegeInitials(name: string): string {
  if (!name) return "";
  
  // 1. Check parenthetical acronym e.g. "Indian Institute of Technology (IIT) Madras" -> IIT
  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const acronym = parenMatch[1]; // e.g. "IIT", "IISc", "IIM", "NIT", "BITS"
    
    // Extract first letter of word immediately following the parenthesis
    // e.g. "(IIT) Madras" -> "M"
    const afterParenMatch = name.match(/\([^)]+\)\s*([A-Za-z])/);
    if (afterParenMatch) {
      return acronym + afterParenMatch[1].toUpperCase();
    }
    return acronym;
  }
  
  // 2. Fallback to extracting capital letters from name parts, filtering common academic terms
  const cleanName = name
    .replace(/(College of Technology|School of Engineering|Deemed University|Faculty of Engineering|University|Institute)/gi, "")
    .trim();
    
  const words = cleanName.split(/\s+/).filter((w) => w.length > 0);
  if (words.length >= 2) {
    return words
      .slice(0, 3)
      .map((w) => w[0].toUpperCase())
      .join("");
  }
  
  return name.slice(0, 3).toUpperCase();
}

// Deterministic gradient selection based on name hash
function getGradientPreset(name: string) {
  const presets = [
    {
      // Deep Royal Indigo
      bg: "from-indigo-600 via-indigo-700 to-violet-800 dark:from-indigo-900/80 dark:to-violet-950/80",
      accent: "text-indigo-200",
      glow: "bg-indigo-400/20"
    },
    {
      // Tech Steel Blue
      bg: "from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900/80 dark:to-indigo-950/80",
      accent: "text-blue-200",
      glow: "bg-blue-400/20"
    },
    {
      // Purple Velvet
      bg: "from-violet-600 via-purple-700 to-fuchsia-800 dark:from-violet-900/80 dark:to-fuchsia-950/80",
      accent: "text-purple-200",
      glow: "bg-purple-400/20"
    },
    {
      // Emerald Forest
      bg: "from-teal-600 via-emerald-700 to-cyan-800 dark:from-teal-900/80 dark:to-cyan-950/80",
      accent: "text-emerald-200",
      glow: "bg-emerald-400/20"
    },
    {
      // Crimson Gold
      bg: "from-rose-600 via-pink-700 to-rose-800 dark:from-rose-900/80 dark:to-rose-950/80",
      accent: "text-rose-200",
      glow: "bg-rose-400/20"
    }
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % presets.length;
  return presets[index];
}

export default function CollegePlaceholder({
  name,
  accredited,
  className = "",
  size = "md"
}: CollegePlaceholderProps) {
  const initials = getCollegeInitials(name);
  const preset = getGradientPreset(name);

  // Responsive dimensions
  let heightClass = "h-44";
  let textClass = "text-4xl";
  let badgePadding = "px-2.5 py-0.5";
  let badgeText = "text-[10px]";
  let iconSize = "text-[10px]";

  if (size === "sm") {
    heightClass = "h-16 w-16";
    textClass = "text-base";
    badgePadding = "px-1 py-0.2";
    badgeText = "text-[7px]";
    iconSize = "text-[8px]";
  } else if (size === "lg") {
    heightClass = "h-64 sm:h-80";
    textClass = "text-6xl sm:text-8xl";
    badgePadding = "px-3 py-1";
    badgeText = "text-xs";
    iconSize = "text-xs";
  }

  // Extract rank number for concise display in small sizes
  const rankNumber = accredited.match(/#(\d+)/)?.[1] || "";

  return (
    <div
      className={`relative w-full ${heightClass} ${preset.bg} bg-gradient-to-br flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      {/* Decorative premium elements */}
      {/* Mesh Glow 1 */}
      <div className={`absolute -top-12 -left-12 w-32 h-32 ${preset.glow} rounded-full blur-xl`} />
      {/* Mesh Glow 2 */}
      <div className={`absolute -bottom-16 -right-16 w-40 h-40 ${preset.glow} rounded-full blur-2xl`} />

      {/* SVG Grid Overlay */}
      <div
        className="absolute inset-0 opacity-15 dark:opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "16px 16px"
        }}
      />

      {/* Inner subtle borders for depth */}
      <div className="absolute inset-2 border border-white/5 rounded-[inherit] pointer-events-none" />

      {/* College Initials Text */}
      <span
        className={`font-bold select-none ${preset.accent} tracking-wider ${textClass} drop-shadow-md`}
        style={{
          fontFamily: "var(--font-literata), serif",
          textShadow: "0 4px 10px rgba(0,0,0,0.2)"
        }}
      >
        {initials}
      </span>

      {/* Rank Badge overlay (Only for medium and large sizes) */}
      {size !== "sm" && accredited && (
        <div
          className={`absolute bottom-3 left-3 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-lg ${badgeText} font-bold text-white tracking-wide shadow-sm flex items-center gap-1`}
        >
          <span
            className={`material-symbols-outlined ${iconSize} text-amber-400`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            military_tech
          </span>
          {accredited}
        </div>
      )}
      
      {/* Mini Rank Badge for small size */}
      {size === "sm" && rankNumber && (
        <div className="absolute top-1 left-1 bg-amber-500 text-on-primary font-bold px-1 rounded text-[8px] flex items-center justify-center shadow-sm">
          #{rankNumber}
        </div>
      )}
    </div>
  );
}
