"use client";

import { useEffect, useRef, useState } from "react";
import { toggleBookmark, isBookmarked } from "../utils/bookmarks";
import { saveSignal } from "@/lib/feedSignals";

type Props = {
  id: string;
  image: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  category?: string;
};

export default function NewsCard({
  id,
  image,
  headline,
  summary,
  source,
  url,
  category = "general",
}: Props) {
  const [saved, setSaved] = useState(false);
  const viewStartRef = useRef<number | null>(null);

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    setSaved(isBookmarked(id));
  }, [id]);

  /* ---------------- DWELL TIME ---------------- */

  useEffect(() => {
    viewStartRef.current = Date.now();

    return () => {
      if (!viewStartRef.current) return;

      const dwellTime = Date.now() - viewStartRef.current;

      saveSignal({
        articleId: id,
        category,
        source,
        viewedAt: Date.now(),
        dwellTime,
        skipped: dwellTime < 1200,
      });
    };
  }, [id, category, source]);

  /* ---------------- BOOKMARK ---------------- */

  const handleBookmark = (e: any) => {
    e.stopPropagation();

    toggleBookmark({
      id,
      image,
      headline,
      summary,
      source,
      url,
    });

    setSaved((p) => !p);

    saveSignal({
      articleId: id,
      category,
      source,
      viewedAt: Date.now(),
      dwellTime: 5000,
      bookmarked: true,
    });

    navigator.vibrate?.(10);
  };

  /* ---------------- SHARE ---------------- */

  const handleShare = async (e: any) => {
    e.stopPropagation();

    let shared = false;

    if (navigator.share) {
      try {
        await navigator.share({
          title: headline,
          text: summary,
          url,
        });
        shared = true;
      } catch {}
    }

    if (!shared) {
      try {
        const t = document.createElement("textarea");
        t.value = url;
        t.style.position = "fixed";
        t.style.opacity = "0";
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        document.body.removeChild(t);
        navigator.vibrate?.(5);
      } catch {}
    }
  };

  /* ---------------- LEARN MORE ---------------- */

  const handleLearnMore = (e: any) => {
    e.stopPropagation();

    saveSignal({
      articleId: id,
      category,
      source,
      viewedAt: Date.now(),
      dwellTime: 8000,
      liked: true,
    });

    window.open(url, "_blank");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="h-full w-full bg-white dark:bg-black flex flex-col news-card-enter">
      {/* Image */}
      <div className="h-56 shrink-0">
        <img
          src={image}
          alt="news"
          loading="lazy"
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <h2 className="font-bold text-lg mb-3 text-black dark:text-white">
          {headline}
        </h2>

        <p className="text-gray-700 dark:text-gray-300">{summary}</p>

        <p className="text-xs text-gray-500 mt-4">
          Source: {source}
        </p>

        {/* Actions */}
        <div className="mt-3 flex justify-between items-center">
          <button
            onClick={handleLearnMore}
            onTouchStart={handleLearnMore}
            className="text-blue-600 dark:text-blue-400 font-semibold active:scale-95 transition-transform"
          >
            Learn more →
          </button>

          <div className="flex gap-4 text-sm font-medium">
            <button
              onClick={handleBookmark}
              onTouchStart={handleBookmark}
              className="active:scale-95 transition-transform"
            >
              {saved ? "✅ Bookmarked" : "🔖 Bookmark"}
            </button>

            <button
              onClick={handleShare}
              onTouchStart={handleShare}
              className="active:scale-95 transition-transform"
            >
              🔗 Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
