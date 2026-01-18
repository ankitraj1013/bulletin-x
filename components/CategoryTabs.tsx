"use client";

const categories = [
  "Bulletin-X",
  "Memes",
  "Trending",
  "Sports",
  "Global",
  "Tech",
  "Entertainment",
];

type Props = {
  active: string;
  onChange: (category: string) => void;
};

export default function CategoryTabs({ active, onChange }: Props) {
  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="flex overflow-x-auto gap-5 px-4 py-3">
        {categories.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`whitespace-nowrap text-sm font-semibold pb-1 ${
                isActive
                  ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                  : "text-gray-400"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
