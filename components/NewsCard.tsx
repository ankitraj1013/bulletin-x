"use client";

import { useEffect, useState } from "react";
import { toggleBookmark, isBookmarked } from "../utils/bookmarks";

type Props = {
  id: string;        // 🔑 stable (url-based)
  image: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
};

export default function NewsCard({
  id,
  image,
  headline,
  summary,
  source,
  url,
}: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(id));
  }, [id]);

  /* ---------------- BOOKMARK ---------------- */

  const handleBookmark = (
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation(); // prevent swipe

    toggleBookmark({
      id,
      image,
      headline,
      summary,
      source,
      url,
    });

    setSaved((prev) => !prev);
    navigator.vibrate?.(10);
  };

  /* ---------------- SHARE (INSHORTS-STYLE) ---------------- */

  const handleShare = async (
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();

    let shared = false;

    // 1️⃣ Try native system share (apps list)
    if (navigator.share) {
      try {
        await navigator.share({
          title: headline,
          text: summary,
          url,
        });
        shared = true;
      } catch {
        // user cancelled or OS blocked
      }
    }

    // 2️⃣ Silent fallback (NO alerts, NO blocking UX)
    if (!shared) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        navigator.vibrate?.(5); // subtle feedback
      } catch {
        // intentionally silent
      }
    }
  };

  /* ---------------- LEARN MORE ---------------- */

  const handleLearnMore = (
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="h-full w-full bg-white dark:bg-black flex flex-col">
      {/* Image */}
      <div className="h-56 shrink-0">
        <img
          src={image}
          alt="news"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <h2 className="font-bold text-lg mb-3 text-black dark:text-white">
          {headline}
        </h2>

        <p className="text-gray-700 dark:text-gray-300">
          {summary}
        </p>

        <p className="text-xs text-gray-500 mt-4">
          Source: {source}
        </p>

        {/* Actions */}
        <div className="mt-3 flex justify-between items-center">
          <button
            onClick={handleLearnMore}
            onTouchStart={handleLearnMore}
            className="text-blue-600 dark:text-blue-400 font-semibold"
          >
            Learn more →
          </button>

          <div className="flex gap-4 text-sm font-medium">
            <button
              onClick={handleBookmark}
              onTouchStart={handleBookmark}
            >
              {saved ? "✅ Bookmarked" : "🔖 Bookmark"}
            </button>

            <button
              onClick={handleShare}
              onTouchStart={handleShare}
            >
              🔗 Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
