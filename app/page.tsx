"use client";

import { useEffect, useRef, useState } from "react";
import NewsCard from "../components/NewsCard";
import CategoryTabs from "../components/CategoryTabs";
import BottomNav from "../components/BottomNav";
import { toggleBookmark, isBookmarked } from "../utils/bookmarks";

const TOP_BAR_HEIGHT = 56;
const BOTTOM_BAR_HEIGHT = 56;
const ACTION_BAR_HEIGHT = 48;

// STACK animation tuning
const SWIPE_THRESHOLD = 60;
const STACK_SCALE_MIN = 0.96;
const STACK_SHADOW = "0 20px 40px rgba(0,0,0,0.15)";

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Bulletin-X");
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  const startY = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const current = news[index];
  const next = news[index + 1];

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

  /* ---------------- STACK SWIPE ---------------- */

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    if (cardRef.current) {
      cardRef.current.style.transition = "none";
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!startY.current || !cardRef.current) return;

    const y = e.touches[0].clientY;
    const diff = y - startY.current;

    const scale = Math.max(
      STACK_SCALE_MIN,
      1 - Math.abs(diff) / 2000
    );

    // 🔥 MEMES DETECTION (ROBUST)
    const isMemes = category.toLowerCase().includes("meme");

    // 🔥 STRONGER, VISIBLE TILT (±3deg)
    const tilt = isMemes
      ? Math.max(-3, Math.min(3, diff / 100))
      : 0;

    // 🔥 KEY FIX: transform-origin for visible rotation
    cardRef.current.style.transformOrigin = "center bottom";

    // MAIN swipe (unchanged physics)
    cardRef.current.style.transform =
      `translateY(${diff}px) scale(${scale}) rotate(${tilt}deg)`;
    cardRef.current.style.boxShadow = STACK_SHADOW;

    // PARALLAX (visual only)
    if (parallaxRef.current) {
      parallaxRef.current.style.transform =
        `translateY(${diff * 0.12}px)`;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!startY.current || !cardRef.current) return;

    const diff = e.changedTouches[0].clientY - startY.current;

    if (diff < -SWIPE_THRESHOLD && index < news.length - 1) {
      setIndex((i) => i + 1);
    } else if (diff > SWIPE_THRESHOLD && index > 0) {
      setIndex((i) => i - 1);
    }

    cardRef.current.style.transition =
      "transform 180ms cubic-bezier(0.25,0.46,0.45,0.94)";
    cardRef.current.style.transformOrigin = "center center";
    cardRef.current.style.transform =
      "translateY(0) scale(1) rotate(0deg)";
    cardRef.current.style.boxShadow = "none";

    if (parallaxRef.current) {
      parallaxRef.current.style.transform = "translateY(0)";
    }

    startY.current = null;
  };

  /* ---------------- RENDER ---------------- */

  return (
    <main className="h-screen bg-gray-100 dark:bg-black">
      <CategoryTabs
        active={category}
        onChange={(c) => {
          setCategory(c);
          setIndex(0);
        }}
      />

      <div
        className="relative overflow-hidden"
        style={{
          height: `calc(100vh - ${
            TOP_BAR_HEIGHT + ACTION_BAR_HEIGHT + BOTTOM_BAR_HEIGHT
          }px)`,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* PEEK CARD */}
        {next && (
          <div className="absolute inset-0 peek-card pointer-events-none">
            <NewsCard {...next} />
          </div>
        )}

        {/* ACTIVE CARD */}
        <div ref={cardRef} className="absolute inset-0">
          <div ref={parallaxRef} className="h-full">
            {loading || !current ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                Loading…
              </div>
            ) : (
              <NewsCard {...current} />
            )}
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      {current && (
        <div
          className="fixed left-0 right-0 bg-white dark:bg-black px-4 flex justify-between items-center z-40"
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
