"use client";

import { useState } from "react";

const interests = [
  "Memes",
  "Trending",
  "Sports",
  "Global",
  "Tech",
  "Entertainment",
];

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (i: string) => {
    if (selected.includes(i))
      setSelected(selected.filter((x) => x !== i));
    else if (selected.length < 5)
      setSelected([...selected, i]);
  };

  return (
    <div className="h-full bg-white dark:bg-black p-4">
      <input
        className="w-full border px-3 py-2 rounded mb-4 dark:bg-black"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <p className="font-medium mb-2">Select up to 5 interests</p>

      <div className="flex flex-wrap gap-2">
        {interests.map((i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`px-3 py-1 rounded-full border ${
              selected.includes(i)
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {i}
          </button>
        ))}
      </div>

      <hr className="my-4" />

      <button
        onClick={() =>
          window.dispatchEvent(new Event("open-bookmarks"))
        }
        className="text-blue-600 dark:text-blue-400 font-medium"
      >
        📌 View Bookmarks
      </button>
    </div>
  );
}
