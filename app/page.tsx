"use client";

import { useEffect, useRef, useState } from "react";
import NewsCard from "../components/NewsCard";
import NewsCardSkeleton from "../components/NewsCardSkeleton";
import CategoryTabs from "../components/CategoryTabs";
import BottomNav from "../components/BottomNav";
import SearchScreen from "../components/SearchScreen";
import ProfileScreen from "../components/ProfileScreen";
import BookmarksScreen from "../components/BookmarksScreen";

const TOP_BAR_HEIGHT = 56;
const BOTTOM_BAR_HEIGHT = 56;

// Inshorts-style swipe tuning
const SWIPE_THRESHOLD = 60;
const VELOCITY_THRESHOLD = 0.35;
const SNAP_DURATION = 180;

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Bulletin-X");
  const [index, setIndex] = useState(0);
  const [nav, setNav] = useState<"home" | "search" | "profile" | "bookmarks">("home");

  const startY = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

  /* ---------------- SWIPE HANDLERS (OVERLAY) ---------------- */

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    lastY.current = startY.current;
    startTime.current = Date.now();
    if (cardRef.current) cardRef.current.style.transition = "none";
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY.current || !cardRef.current) return;
    const y = e.touches[0].clientY;
    const diff = y - startY.current;
    lastY.current = y;
    cardRef.current.style.transform = `translateY(${diff}px)`;
  };

  const handleTouchEnd = () => {
    if (!startY.current || !lastY.current || !startTime.current || !cardRef.current) return;

    const diff = lastY.current - startY.current;
    const velocity = Math.abs(diff / (Date.now() - startTime.current));

    // UP → next
    if (
      diff < 0 &&
      index < news.length - 1 &&
      (Math.abs(diff) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD)
    ) {
      navigator.vibrate?.(8);
      setIndex((i) => i + 1);
    }

    // DOWN → previous
    else if (diff > 0 && index > 0 && Math.abs(diff) > SWIPE_THRESHOLD) {
      navigator.vibrate?.(8);
      setIndex((i) => i - 1);
    }

    cardRef.current.style.transition =
      `transform ${SNAP_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    cardRef.current.style.transform = "translateY(0)";

    startY.current = lastY.current = startTime.current = null;
  };

  /* ---------------- RENDER ---------------- */

  return (
    <main className="h-screen bg-gray-100 dark:bg-black">
      <CategoryTabs
        active={category}
        onChange={(c) => {
          setCategory(c);
          setIndex(0);
          setNav("home");
        }}
      />

      {/* CLIP AREA */}
      <div
        style={{
          height: `calc(100vh - ${TOP_BAR_HEIGHT}px - ${BOTTOM_BAR_HEIGHT}px)`,
          overflow: "hidden",
        }}
      >
        <div className="relative h-full">
          {/* GESTURE OVERLAY (captures all swipes) */}
          {nav === "home" && (
            <div
              className="absolute inset-0 z-10"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          )}

          {/* CARD LAYER */}
          <div ref={cardRef} className="h-full will-change-transform">
            {nav === "home" &&
              (loading || !news[index] ? (
                <NewsCardSkeleton />
              ) : (
                <NewsCard {...news[index]} />
              ))}

            {nav === "search" && <SearchScreen />}
            {nav === "profile" && <ProfileScreen />}
            {nav === "bookmarks" && (
              <BookmarksScreen onBack={() => setNav("profile")} />
            )}
          </div>
        </div>
      </div>

      <BottomNav
        active={nav === "bookmarks" ? "profile" : nav}
        onHome={() => {
          setNav("home");
          setCategory("Bulletin-X");
          setIndex(0);
        }}
        onSearch={() => setNav("search")}
        onProfile={() => setNav("profile")}
      />
    </main>
  );
}
