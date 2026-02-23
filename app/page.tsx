"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import NewsCard from "@/components/NewsCard";
import NewsCardSkeleton from "@/components/NewsCardSkeleton";
import CategoryTabs from "@/components/CategoryTabs";
import BottomNav from "@/components/BottomNav";
import SearchScreen from "@/components/SearchScreen";
import ProfileScreen from "@/components/ProfileScreen";
import Onboarding from "@/components/Onboarding";

const SWIPE_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 0.45;
const SNAP_DURATION = 260;

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("Bulletin-X");
  const [index, setIndex] = useState(0);
  const [nav, setNav] =
    useState<"home" | "search" | "profile">("home");
  const [showOnboarding, setShowOnboarding] = useState(false);

  const startY = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);

  /* ---------------- ONBOARDING ---------------- */

  useEffect(() => {
    if (typeof window !== "undefined") {
      const done = localStorage.getItem("bulletin_onboarding_done");
      if (!done) setShowOnboarding(true);
    }
  }, []);

  /* ---------------- FETCH NEWS ---------------- */

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await fetch(
        `/api/news?category=${encodeURIComponent(category)}`
      );

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
      setIndex(0);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (nav === "home") {
      fetchNews();
    }
  }, [fetchNews, nav]);

  /* ---------------- PRELOAD NEXT IMAGE ---------------- */

  useEffect(() => {
    if (!news[index + 1]?.image) return;

    const img = new Image();
    img.src = news[index + 1].image;
  }, [index, news]);

  /* ---------------- SWIPE ENGINE ---------------- */

  const handleTouchStart = (e: React.TouchEvent) => {
    if (nav !== "home" || loading) return;

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
    activeCardRef.current.style.transform = `translateY(${diff}px)`;
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
    const duration = Date.now() - startTime.current;
    const velocity = Math.abs(diff / duration);

    let newIndex = index;

    if (
      diff < 0 &&
      index < news.length - 1 &&
      (Math.abs(diff) > SWIPE_THRESHOLD ||
        velocity > VELOCITY_THRESHOLD)
    ) {
      newIndex = index + 1;
    }

    if (
      diff > 0 &&
      index > 0 &&
      (Math.abs(diff) > SWIPE_THRESHOLD ||
        velocity > VELOCITY_THRESHOLD)
    ) {
      newIndex = index - 1;
    }

    if (newIndex !== index) {
      navigator.vibrate?.(8);
      setIndex(newIndex);
    }

    activeCardRef.current.style.transition =
      `transform ${SNAP_DURATION}ms cubic-bezier(0.22,1,0.36,1)`;
    activeCardRef.current.style.transform = "translateY(0)";

    startY.current = null;
    lastY.current = null;
    startTime.current = null;
  };

  return (
    <main className="h-screen flex flex-col bg-black text-white overflow-hidden">

      {showOnboarding && (
        <Onboarding onFinish={() => setShowOnboarding(false)} />
      )}

      {nav === "home" && (
        <CategoryTabs
          active={category}
          onChange={(c) => setCategory(c)}
        />
      )}

      <div className="relative flex-1 overflow-hidden pb-24">

        {nav === "home" && (
          <div
            className="relative h-full overflow-hidden touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {loading && <NewsCardSkeleton />}

            {error && (
              <div className="flex items-center justify-center h-full text-center p-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Failed to load news
                  </h2>
                  <button
                    onClick={fetchNews}
                    className="px-4 py-2 bg-white text-black rounded-full"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && news[index] && (
              <div
                ref={activeCardRef}
                className="relative h-full will-change-transform transform-gpu"
              >
                <NewsCard {...news[index]} />
              </div>
            )}
          </div>
        )}

        {nav === "search" && <SearchScreen />}
        {nav === "profile" && <ProfileScreen />}
      </div>

      <BottomNav
        active={nav}
        onHome={() => setNav("home")}
        onSearch={() => setNav("search")}
        onProfile={() => setNav("profile")}
      />
    </main>
  );
}