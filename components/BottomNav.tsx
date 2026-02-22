"use client";

import { Home, Search, User } from "lucide-react";

type Props = {
  active: "home" | "search" | "profile";
  onHome: () => void;
  onSearch: () => void;
  onProfile: () => void;
};

export default function BottomNav({
  active,
  onHome,
  onSearch,
  onProfile,
}: Props) {
  const baseStyle =
    "flex flex-col items-center justify-center gap-1 text-xs transition-all duration-300";

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
      <div className="flex justify-around items-center h-16 rounded-2xl backdrop-blur-xl bg-black/70 border border-zinc-800 shadow-2xl">
        
        <button
          onClick={onHome}
          className={`${baseStyle} ${
            active === "home"
              ? "text-indigo-400 scale-105"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Home size={20} strokeWidth={2} />
          Home
        </button>

        <button
          onClick={onSearch}
          className={`${baseStyle} ${
            active === "search"
              ? "text-indigo-400 scale-105"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Search size={20} strokeWidth={2} />
          Search
        </button>

        <button
          onClick={onProfile}
          className={`${baseStyle} ${
            active === "profile"
              ? "text-indigo-400 scale-105"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <User size={20} strokeWidth={2} />
          Profile
        </button>
      </div>
    </div>
  );
}
