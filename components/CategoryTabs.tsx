"use client";

import { useEffect, useRef, memo } from "react";

const categories = [
  "Bulletin-X",
  "Memes",
  "Trending",
  "Sports",
  "Global",
  "Tech",
  "Entertainment",
];

interface Props {
  active: string;
  onChange: (category: string) => void;
}

function CategoryTabsComponent({ active, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeEl = containerRef.current?.querySelector(
      `[data-active="true"]`
    ) as HTMLElement;

    activeEl?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/5">

      <div
        ref={containerRef}
        className="flex items-center h-12 px-3 gap-2 overflow-x-auto scrollbar-hide"
      >
        {categories.map((cat) => {
          const isActive = active === cat;

          return (
            <button
              key={cat}
              data-active={isActive}
              onClick={() => onChange(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200
              
              ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "text-gray-400 hover:text-white"
              }
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(CategoryTabsComponent);