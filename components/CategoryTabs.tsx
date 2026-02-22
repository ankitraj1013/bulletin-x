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
    <div className="h-14 sticky top-0 z-40 bg-black border-b border-zinc-800">
      <div className="flex items-center h-full overflow-x-auto gap-3 px-4">
        {categories.map((cat) => {
          const isActive = active === cat;

          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 whitespace-nowrap
                ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
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