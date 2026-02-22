"use client";

import { useEffect, useRef, useState } from "react";
import NewsCard from "@/components/NewsCard";
import NewsCardSkeleton from "@/components/NewsCardSkeleton";
import CategoryTabs from "@/components/CategoryTabs";
import BottomNav from "@/components/BottomNav";
import SearchScreen from "@/components/SearchScreen";
import ProfileScreen from "@/components/ProfileScreen";
import BookmarksScreen from "@/components/BookmarksScreen";

const SWIPE_THRESHOLD = 70;
const VELOCITY_THRESHOLD = 0.4;
const SNAP_DURATION = 280;

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Bulletin-X");
  const [index, setIndex] = useState(0);
  const [nav, setNav] =
    useState<"home" | "search" | "profile" | "bookmarks">("home");

  const startY = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const activeCardRef = useRef<HTMLDivElement>(null);

  /* ---------------- FETCH NEWS ---------------- */

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/news?category=${encodeURIComponent(category)}`
        );
        const data = await res.json();
        setNews(Array.isArray(data) ? data : []);
        setIndex(0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  /* ---------------- PRELOAD NEXT IMAGE ---------------- */

  useEffect(() => {
    if (news[index + 1]?.image) {
      const img = new Image();
      img.src = news[index + 1].image;
    }
  }, [index, news]);

  /* ---------------- SWIPE LOGIC ---------------- */

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    lastY.current = startY.current;
    startTime.current = Date.now();

    if (activeCardRef.current) {
      activeCardRef.current.style.transition = "none";
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY.current || !activeCardRef.current) return;

    const diff = e.touches[0].clientY - startY.current;
    lastY.current = e.touches[0].clientY;

    const scale = 1 - Math.min(Math.abs(diff) / 2000, 0.05);

    activeCardRef.current.style.transform =
      `translateY(${diff}px) scale(${scale})`;
  };

  const handleTouchEnd = () => {
    if (
      !startY.current ||
      !lastY.current ||
      !startTime.current ||
      !activeCardRef.current
    )
      return;

    const diff = lastY.current - startY.current;
    const velocity = Math.abs(diff / (Date.now() - startTime.current));

    if (
      diff < 0 &&
      index < news.length - 1 &&
      (Math.abs(diff) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD)
    ) {
      if (navigator.vibrate) navigator.vibrate(15);
      setIndex((i) => i + 1);
    } else if (
      diff > 0 &&
      index > 0 &&
      (Math.abs(diff) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD)
    ) {
      if (navigator.vibrate) navigator.vibrate(15);
      setIndex((i) => i - 1);
    }

    activeCardRef.current.style.transition =
      `transform ${SNAP_DURATION}ms cubic-bezier(0.22,1,0.36,1)`;
    activeCardRef.current.style.transform =
      "translateY(0) scale(1)";

    startY.current = null;
    lastY.current = null;
    startTime.current = null;
  };

  /* ---------------- RENDER ---------------- */

  return (
    <main className="flex flex-col h-screen pb-24">
      <CategoryTabs
        active={category}
        onChange={(c) => {
          setCategory(c);
          setNav("home");
        }}
      />

      <div className="flex-1 relative overflow-hidden bg-black">

        {nav === "home" && (
          <div
            className="relative h-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >

            {loading && <NewsCardSkeleton />}

            {!loading && news[index] && (
              <>
                {/* PREVIEW CARD (FIXED) */}
                {news[index + 1] && (
                  <div className="absolute inset-0 scale-95 opacity-30 translate-y-6 pointer-events-none overflow-hidden rounded-2xl">
                    <NewsCard {...news[index + 1]} />
                  </div>
                )}

                {/* ACTIVE CARD (ONLY THIS MOVES) */}
                <div
                  ref={activeCardRef}
                  className="relative z-10 will-change-transform"
                >
                  <NewsCard {...news[index]} />
                </div>
              </>
            )}

          </div>
        )}

        {nav === "search" && <SearchScreen />}
        {nav === "profile" && <ProfileScreen />}
        {nav === "bookmarks" && (
          <BookmarksScreen onBack={() => setNav("profile")} />
        )}

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