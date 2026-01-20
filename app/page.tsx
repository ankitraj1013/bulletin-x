"use client";

import { useEffect, useRef, useState } from "react";
import NewsCard from "../components/NewsCard";
import CategoryTabs from "../components/CategoryTabs";
import BottomNav from "../components/BottomNav";
import { toggleBookmark, isBookmarked } from "../utils/bookmarks";

const TOP_BAR_HEIGHT = 56;
const BOTTOM_BAR_HEIGHT = 56;
const ACTION_BAR_HEIGHT = 48;
const SWIPE_THRESHOLD = 60;

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Bulletin-X");
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  const startY = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const current = news[index];

  /* ---------------- FETCH NEWS ---------------- */

  useEffect(() => {
    setLoading(true);
    fetch(`/api/news?category=${encodeURIComponent(category)}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(Array.isArray(data) ? data : []);
        setIndex(0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  /* ---------------- BOOKMARK STATE ---------------- */

  useEffect(() => {
    if (current?.id) {
      setSaved(isBookmarked(current.id));
    }
  }, [current?.id]);

  /* ---------------- SWIPE ---------------- */

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!startY.current) return;
    const diff = e.changedTouches[0].clientY - startY.current;

    if (diff < -SWIPE_THRESHOLD && index < news.length - 1) {
      setIndex((i) => i + 1);
    } else if (diff > SWIPE_THRESHOLD && index > 0) {
      setIndex((i) => i - 1);
    }

    startY.current = null;
  };

  return (
    <main className="h-screen bg-gray-100 dark:bg-black">
      <CategoryTabs
        active={category}
        onChange={(c) => {
          setCategory(c);
          setIndex(0);
        }}
      />

      {/* CONTENT AREA */}
      <div
        style={{
          height: `calc(100vh - ${TOP_BAR_HEIGHT + BOTTOM_BAR_HEIGHT + ACTION_BAR_HEIGHT}px)`,
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div ref={cardRef} className="h-full">
          {loading || !current ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              Loading…
            </div>
          ) : (
            <NewsCard {...current} />
          )}
        </div>
      </div>

      {/* FIXED ACTION BAR */}
      {current && (
        <div
          className="fixed left-0 right-0 bg-white dark:bg-black px-4 flex justify-between items-center"
          style={{
            height: ACTION_BAR_HEIGHT,
            bottom: BOTTOM_BAR_HEIGHT,
          }}
        >
          <button
            onClick={() => window.open(current.url, "_blank")}
            className="font-medium text-blue-600"
          >
            Learn more →
          </button>

          <div className="flex gap-3 text-sm">
            <button
              onClick={() => {
                toggleBookmark(current);
                setSaved(!saved);
              }}
            >
              {saved ? "✅ Bookmarked" : "🔖 Bookmark"}
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `${current.headline}\n\n${current.url}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 Share
            </a>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
