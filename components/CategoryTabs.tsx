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
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-zinc-800">
      <div className="flex overflow-x-auto gap-3 px-4 py-3 scrollbar-hide">

        {categories.map((cat) => {
          const isActive = active === cat;

          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`whitespace-nowrap text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-300
                ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
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