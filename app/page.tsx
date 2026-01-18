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
const SWIPE_THRESHOLD = 60;        // px
const VELOCITY_THRESHOLD = 0.35;  // px/ms
const SNAP_DURATION = 180;        // ms

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("Bulletin-X");
  const [index, setIndex] = useState(0);
  const [nav, setNav] = useState<
    "home" | "search" | "profile" | "bookmarks"
  >("home");

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

  /* --------- OPEN BOOKMARKS FROM PROFILE ---------- */

  useEffect(() => {
    const open = () => setNav("bookmarks");
    window.addEventListener("open-bookmarks", open);
    return () => window.removeEventListener("open-bookmarks", open);
  }, []);

  /* ---------------- INSHORTS-STYLE SWIPE (FIXED) ---------------- */

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    lastY.current = startY.current;
    startTime.current = Date.now();

    if (cardRef.current) {
      cardRef.current.style.transition = "none";
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY.current || !cardRef.current) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    lastY.current = currentY;
    cardRef.current.style.transform = `translateY(${diff}px)`;
  };

  const handleTouchEnd = () => {
    if (
      !startY.current ||
      !lastY.current ||
      !startTime.current ||
      !cardRef.current
    )
      return;

    const totalDiff = lastY.current - startY.current;
    const timeDiff = Date.now() - startTime.current;
    const velocity = Math.abs(totalDiff / timeDiff);

    // 🔼 Swipe UP → next card (velocity OR distance)
    if (
      totalDiff < 0 &&
      index < news.length - 1 &&
      (Math.abs(totalDiff) > SWIPE_THRESHOLD ||
        velocity > VELOCITY_THRESHOLD)
    ) {
      navigator.vibrate?.(8);
      setIndex((i) => i + 1);
    }

    // 🔽 Swipe DOWN → previous card (distance-based)
    else if (
      totalDiff > 0 &&
      index > 0 &&
      Math.abs(totalDiff) > SWIPE_THRESHOLD
    ) {
      navigator.vibrate?.(8);
      setIndex((i) => i - 1);
    }

    // Hard snap (always)
    cardRef.current.style.transition =
      `transform ${SNAP_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    cardRef.current.style.transform = "translateY(0)";

    startY.current = null;
    lastY.current = null;
    startTime.current = null;
  };

  /* ---------------- RENDER ---------------- */

  return (
    <main className="h-screen bg-gray-100 dark:bg-black">
      {/* TOP CATEGORY BAR */}
      <CategoryTabs
        active={category}
        onChange={(c) => {
          setCategory(c);
          setIndex(0);
          setNav("home");
        }}
      />

      {/* MAIN CONTENT */}
      <div
        ref={cardRef}
        style={{
          height: `calc(100vh - ${TOP_BAR_HEIGHT}px - ${BOTTOM_BAR_HEIGHT}px)`,
        }}
        onTouchStart={nav === "home" ? handleTouchStart : undefined}
        onTouchMove={nav === "home" ? handleTouchMove : undefined}
        onTouchEnd={nav === "home" ? handleTouchEnd : undefined}
      >
        {/* HOME FEED */}
        {nav === "home" &&
          (loading || !news[index] ? (
            <NewsCardSkeleton />
          ) : (
            <NewsCard {...news[index]} />
          ))}

        {/* SEARCH */}
        {nav === "search" && <SearchScreen />}

        {/* PROFILE */}
        {nav === "profile" && <ProfileScreen />}

        {/* BOOKMARKS */}
        {nav === "bookmarks" && (
          <BookmarksScreen onBack={() => setNav("profile")} />
        )}
      </div>

      {/* BOTTOM NAV */}
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
