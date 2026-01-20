"use client";

import { useEffect, useState } from "react";
import { toggleBookmark, isBookmarked } from "../utils/bookmarks";

export default function NewsCard({
  id,
  image,
  headline,
  summary,
  source,
  url,
}: any) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(id));
  }, [id]);

  /* ---------------- SHARE (BULLETPROOF) ---------------- */

  const handleShare = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Try native share first
    if (navigator.share) {
      e.preventDefault(); // stop link navigation
      navigator
        .share({
          title: headline,
          text: summary,
          url,
        })
        .catch(() => {
          // user cancelled → fallback to link
          window.open(
            `https://wa.me/?text=${encodeURIComponent(
              `${headline}\n\n${url}`
            )}`,
            "_blank"
          );
        });
    }
    // else → let browser open link normally
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      {/* CONTENT (SWIPE AREA) */}
      <div className="flex-1 px-4 py-3">
        <div className="h-56 mb-3">
          <img
            src={image}
            alt="news"
            className="h-full w-full object-cover"
          />
        </div>

        <h2 className="font-bold text-lg mb-3">
          {headline}
        </h2>

        <p className="text-gray-700 dark:text-gray-300">
          {summary}
        </p>

        <p className="text-xs text-gray-500 mt-3">
          Source: {source}
        </p>
      </div>

      {/* ACTION BLOCK (NO SWIPE HERE) */}
      <div className="border-t px-4 py-3 flex justify-between items-center">
        <button
          onClick={() => window.open(url, "_blank")}
          className="font-medium"
        >
          Learn more →
        </button>

        <div className="flex gap-4 text-sm">
          <button
            onClick={() => {
              toggleBookmark({
                id,
                image,
                headline,
                summary,
                source,
                url,
              });
              setSaved(!saved);
            }}
          >
            {saved ? "✅ Bookmarked" : "🔖 Bookmark"}
          </button>

          {/* 🔥 GUARANTEED SHARE */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `${headline}\n\n${url}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleShare}
          >
            🔗 Share
          </a>
        </div>
      </div>
    </div>
  );
}
