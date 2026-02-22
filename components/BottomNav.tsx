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
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-black border-t border-zinc-800">
      <div className="flex items-center justify-around h-full">

        <button
          onClick={onHome}
          className="flex flex-col items-center justify-center gap-1"
        >
          <Home
            size={20}
            className={
              active === "home"
                ? "text-indigo-400"
                : "text-zinc-400"
            }
          />
          <span
            className={`text-xs ${
              active === "home"
                ? "text-indigo-400"
                : "text-zinc-400"
            }`}
          >
            Home
          </span>
        </button>

        <button
          onClick={onSearch}
          className="flex flex-col items-center justify-center gap-1"
        >
          <Search
            size={20}
            className={
              active === "search"
                ? "text-indigo-400"
                : "text-zinc-400"
            }
          />
          <span
            className={`text-xs ${
              active === "search"
                ? "text-indigo-400"
                : "text-zinc-400"
            }`}
          >
            Search
          </span>
        </button>

        <button
          onClick={onProfile}
          className="flex flex-col items-center justify-center gap-1"
        >
          <User
            size={20}
            className={
              active === "profile"
                ? "text-indigo-400"
                : "text-zinc-400"
            }
          />
          <span
            className={`text-xs ${
              active === "profile"
                ? "text-indigo-400"
                : "text-zinc-400"
            }`}
          >
            Profile
          </span>
        </button>

      </div>
    </div>
  );
}