"use client";

import { Home, Search, User } from "lucide-react";

export default function BottomNav({
  active,
  onHome,
  onSearch,
  onProfile,
}: any) {
  const navItem = (
    label: string,
    icon: any,
    isActive: boolean,
    onClick: () => void
  ) => (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center flex-1 py-2 active:scale-95 transition"
    >
      <div
        className={`transition-all duration-300 ${
          isActive ? "text-white" : "text-gray-400"
        }`}
      >
        {icon}
      </div>

      <span
        className={`text-[11px] mt-1 font-medium transition-colors duration-300 ${
          isActive ? "text-white" : "text-gray-500"
        }`}
      >
        {label}
      </span>

      <span
        className={`absolute bottom-1 h-1.5 w-1.5 rounded-full bg-indigo-500 transition-all duration-300 ${
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      />
    </button>
  );

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-t border-white/5"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {navItem("Home", <Home size={22} />, active === "home", onHome)}
        {navItem("Search", <Search size={22} />, active === "search", onSearch)}
        {navItem("Profile", <User size={22} />, active === "profile", onProfile)}
      </div>
    </div>
  );
}