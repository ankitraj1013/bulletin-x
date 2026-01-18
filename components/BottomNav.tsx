"use client";

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="flex justify-around items-center h-14">
        <button
          onClick={onHome}
          className={active === "home" ? "text-black dark:text-white" : "text-gray-400"}
        >
          🏠 Home
        </button>
        <button
          onClick={onSearch}
          className={active === "search" ? "text-black dark:text-white" : "text-gray-400"}
        >
          🔍 Search
        </button>
        <button
          onClick={onProfile}
          className={active === "profile" ? "text-black dark:text-white" : "text-gray-400"}
        >
          👤 Profile
        </button>
      </div>
    </div>
  );
}
