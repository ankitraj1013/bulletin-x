"use client";

import { useEffect, useRef, useState } from "react";
import { toggleBookmark, isBookmarked } from "../utils/bookmarks";
import { saveSignal } from "@/lib/feedSignals";

export default function NewsCard({
  id,
  image,
  headline,
  summary,
  source,
  url,
  category = "general",
}: any) {
  const [saved, setSaved] = useState(false);
  const viewStart = useRef<number>(0);

  useEffect(() => {
    setSaved(isBookmarked(id));
    viewStart.current = Date.now();
    return () =>
      saveSignal({
        articleId: id,
        category,
        source,
        viewedAt: Date.now(),
        dwellTime: Date.now() - viewStart.current,
      });
  }, [id, category, source]);

  return (
    <div className="h-full w-full bg-white dark:bg-black flex flex-col select-none">
      <div className="h-56">
        <img src={image} className="h-full w-full object-cover" />
      </div>

      <div className="flex-1 px-4 py-3">
        <h2 className="font-bold text-lg mb-3">{headline}</h2>
        <p className="text-gray-700 dark:text-gray-300">{summary}</p>
        <p className="text-xs text-gray-500 mt-4">Source: {source}</p>

        <div className="mt-3 flex justify-between items-center">
          <button onClick={() => window.open(url, "_blank")}>
            Learn more →
          </button>

          <div className="flex gap-4">
            <button onClick={() => toggleBookmark({ id, image, headline, summary, source, url })}>
              {saved ? "✅ Bookmarked" : "🔖 Bookmark"}
            </button>
            <button onClick={() => navigator.share?.({ title: headline, text: summary, url })}>
              🔗 Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
