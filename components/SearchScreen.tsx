"use client";

import { useState } from "react";
import { newsData } from "../app/newsData";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const results = newsData.filter(
    (n) =>
      n.headline.toLowerCase().includes(query.toLowerCase()) ||
      n.summary.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="h-full bg-white dark:bg-black p-4">
      <input
        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 rounded mb-4 text-black dark:text-white"
        placeholder="Search Bulletin-X..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.map((r) => (
        <div key={r.id} className="border-b border-gray-200 dark:border-gray-800 py-2">
          <p className="font-semibold text-black dark:text-white">
            {r.headline}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {r.source}
          </p>
        </div>
      ))}
    </div>
  );
}
