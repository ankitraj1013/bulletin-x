"use client";

import { useEffect, useState } from "react";
import { toggleBookmark, isBookmarked } from "../utils/bookmarks";

type Props = {
  id: string;   // 🔑 URL-based
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

  const handleBookmark = (
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();

    toggleBookmark({
      id,
      image,
      headline,
      summary,
      source,
      url,
    });

    setSaved((s) => !s);
    navigator.vibrate?.(10);
  };

  const handleShare = async (
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();

    // ✅ Native app list (WhatsApp, Insta, etc.)
    if (navigator.share) {
      try {
        await navigator.share({
          title: headline,
          text: summary,
          url,
        });
        return;
      } catch {
        // user cancelled → fallback
      }
    }

    // ✅ Universal mobile fallback
    try {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      alert("Link copied to clipboard");
    } catch {
      alert("Unable to share");
    }
  };

  return (
    <div className="h-full bg-white dark:bg-black flex flex-col">
      <div className="h-56 shrink-0">
        <img src={image} className="h-full w-full object-cover" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <h2 className="font-bold text-lg mb-3">{headline}</h2>
        <p className="text-gray-700 dark:text-gray-300">{summary}</p>

        <p className="text-xs text-gray-500 mt-4">
          Source: {source}
        </p>

        <div className="mt-3 flex justify-between items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, "_blank");
            }}
            className="text-blue-600 font-semibold"
          >
            Learn more →
          </button>

          <div className="flex gap-4 text-sm">
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
