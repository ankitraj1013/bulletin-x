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
const SWIPE_THRESHOLD = 80;

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("Bulletin-X");
  const [index, setIndex] = useState(0);
  const [nav, setNav] = useState<
    "home" | "search" | "profile" | "bookmarks"
  >("home");

  const startY = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  /* ---------------- FETCH REAL NEWS (GNEWS) ---------------- */

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

  /* --------- OPEN BOOKMARKS FROM PROFILE EVENT ---------- */

  useEffect(() => {
    const open = () => setNav("bookmarks");
    window.addEventListener("open-bookmarks", open);
    return () => window.removeEventListener("open-bookmarks", open);
  }, []);

  /* ---------------- SWIPE HANDLERS ---------------- */

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY.current || !cardRef.current) return;
    const diff = e.touches[0].clientY - startY.current;
    cardRef.current.style.transform = `translateY(${diff}px)`;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startY.current || !cardRef.current) return;

    const diff = e.changedTouches[0].clientY - startY.current;

    if (diff < -SWIPE_THRESHOLD && index < news.length - 1) {
      navigator.vibrate?.(10);
      setIndex((i) => i + 1);
    } else if (diff > SWIPE_THRESHOLD && index > 0) {
      navigator.vibrate?.(10);
      setIndex((i) => i - 1);
    }

    cardRef.current.style.transform = "translateY(0)";
    startY.current = null;
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

      {/* MAIN CONTENT AREA */}
      <div
        ref={cardRef}
        className="transition-transform duration-150 ease-out"
        style={{
          height: `calc(100vh - ${TOP_BAR_HEIGHT}px - ${BOTTOM_BAR_HEIGHT}px)`,
        }}
        onTouchStart={nav === "home" ? handleTouchStart : undefined}
        onTouchMove={nav === "home" ? handleTouchMove : undefined}
        onTouchEnd={nav === "home" ? handleTouchEnd : undefined}
      >
        {/* HOME / NEWS FEED */}
        {nav === "home" && (
          loading || !news[index] ? (
            <NewsCardSkeleton />
          ) : (
            <NewsCard {...news[index]} />
          )
        )}

        {/* SEARCH */}
        {nav === "search" && <SearchScreen />}

        {/* PROFILE */}
        {nav === "profile" && <ProfileScreen />}

        {/* BOOKMARKS */}
        {nav === "bookmarks" && (
          <BookmarksScreen onBack={() => setNav("profile")} />
        )}
      </div>

      {/* BOTTOM NAVIGATION */}
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
