"use client";

import { useEffect, useRef, useState } from "react";
import NewsCard from "@/components/NewsCard";
import NewsCardSkeleton from "@/components/NewsCardSkeleton";
import CategoryTabs from "@/components/CategoryTabs";
import BottomNav from "@/components/BottomNav";
import SearchScreen from "@/components/SearchScreen";
import ProfileScreen from "@/components/ProfileScreen";

const SWIPE_THRESHOLD = 70;
const VELOCITY_THRESHOLD = 0.4;
const SNAP_DURATION = 280;

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Bulletin-X");
  const [index, setIndex] = useState(0);
  const [nav, setNav] =
    useState<"home" | "search" | "profile">("home");

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

    if (nav === "home") {
      fetchNews();
    }
  }, [category, nav]);

  /* ---------------- SWIPE HANDLERS ---------------- */

  const handleTouchStart = (e: React.TouchEvent) => {
    if (nav !== "home") return;

    startY.current = e.touches[0].clientY;
    lastY.current = startY.current;
    startTime.current = Date.now();

    if (activeCardRef.current) {
      activeCardRef.current.style.transition = "none";
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY.current || !activeCardRef.current || nav !== "home") return;

    const diff = e.touches[0].clientY - startY.current;
    lastY.current = e.touches[0].clientY;

    activeCardRef.current.style.transform = `translateY(${diff}px)`;
  };

  const handleTouchEnd = () => {
    if (
      !startY.current ||
      !lastY.current ||
      !startTime.current ||
      !activeCardRef.current ||
      nav !== "home"
    )
      return;

    const diff = lastY.current - startY.current;
    const velocity = Math.abs(diff / (Date.now() - startTime.current));

    if (
      diff < 0 &&
      index < news.length - 1 &&
      (Math.abs(diff) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD)
    ) {
      navigator.vibrate?.(15);
      setIndex((i) => i + 1);
    }

    if (
      diff > 0 &&
      index > 0 &&
      (Math.abs(diff) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD)
    ) {
      navigator.vibrate?.(15);
      setIndex((i) => i - 1);
    }

    activeCardRef.current.style.transition =
      `transform ${SNAP_DURATION}ms cubic-bezier(0.22,1,0.36,1)`;
    activeCardRef.current.style.transform = "translateY(0)";

    startY.current = null;
    lastY.current = null;
    startTime.current = null;
  };

  /* ---------------- RENDER ---------------- */

  return (
    <main className="h-screen flex flex-col bg-black">

      {/* TOP CATEGORY TABS */}
      {nav === "home" && (
        <CategoryTabs
          active={category}
          onChange={(c) => {
            setCategory(c);
            setIndex(0);
          }}
        />
      )}

      {/* CONTENT AREA */}
      <div
        className="relative overflow-hidden"
        style={{
          height:
            nav === "home"
              ? "calc(100vh - 56px - 64px)"
              : "calc(100vh - 64px)",
        }}
      >
        {nav === "home" && (
          <div
            className="relative h-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {loading && <NewsCardSkeleton />}

            {!loading && news[index] && (
              <div ref={activeCardRef} className="relative h-full">
                <NewsCard {...news[index]} />
              </div>
            )}
          </div>
        )}

        {nav === "search" && <SearchScreen />}
        {nav === "profile" && <ProfileScreen />}
      </div>

      {/* BOTTOM NAV */}
      <BottomNav
        active={nav}
        onHome={() => setNav("home")}
        onSearch={() => setNav("search")}
        onProfile={() => setNav("profile")}
      />
    </main>
  );
}