"use client";

const categories = [
  { label: "Bulletin-X", value: "Bulletin-X" },
  { label: "Trending", value: "trending" },
  { label: "Memes", value: "memes" },
  { label: "World", value: "world" },
  { label: "Business", value: "business" },
  { label: "Technology", value: "technology" },
  { label: "Sports", value: "sports" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Health", value: "health" },
  { label: "Science", value: "science" },
  ];

export default function CategoryTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex gap-2 px-1 py-2 overflow-x-auto bg-white dark:bg-black">
      {categories.map((c) => {
        const selected = active === c.value;
        return (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            className={`px-2 py-1 rounded-full text-sm whitespace-nowrap transition-all
              ${
                selected
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-500 dark:text-gray-400"
              }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
