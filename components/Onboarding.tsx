"use client";

import { useRef, useState } from "react";

type Props = {
  onFinish: () => void;
};

const slides = [
  {
    title: "Stay Updated Instantly",
    description:
      "Get short, powerful news summaries in seconds. No clutter. No noise.",
  },
  {
    title: "Bookmark & Share",
    description:
      "Save important stories and share them instantly with one tap.",
  },
  {
    title: "Explore Smart Categories",
    description:
      "Switch between Trending, Sports, Tech and more effortlessly.",
  },
];

const SWIPE_THRESHOLD = 60;

export default function Onboarding({ onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);

  /* ---------------- SWIPE HANDLERS ---------------- */

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!startX.current || !currentX.current) return;

    const diff = currentX.current - startX.current;

    if (diff < -SWIPE_THRESHOLD && index < slides.length - 1) {
      setIndex(index + 1);
      navigator.vibrate?.(8);
    }

    if (diff > SWIPE_THRESHOLD && index > 0) {
      setIndex(index - 1);
      navigator.vibrate?.(8);
    }

    startX.current = null;
    currentX.current = null;
  };

  const finish = () => {
    localStorage.setItem("bulletin_onboarding_done", "true");
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black text-white">

      {/* Animated Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse -top-40 -left-40" />
        <div className="absolute w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse bottom-0 right-0" />
      </div>

      {/* Slides Container */}
      <div
        className="relative h-full flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="min-w-full flex flex-col items-center justify-center px-8 text-center"
          >
            <h1 className="text-3xl font-bold mb-6">
              {slide.title}
            </h1>
            <p className="text-gray-300 leading-relaxed max-w-sm">
              {slide.description}
            </p>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-28 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-indigo-500 w-6"
                : "bg-gray-600 w-2"
            }`}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="absolute bottom-10 w-full px-6">
        <button
          onClick={index === slides.length - 1 ? finish : () => setIndex(index + 1)}
          className="w-full py-3 rounded-full bg-indigo-600 font-semibold"
        >
          {index === slides.length - 1
            ? "Get Started"
            : "Next"}
        </button>

        <button
          onClick={finish}
          className="w-full text-sm text-gray-400 mt-4"
        >
          Skip
        </button>
      </div>
    </div>
  );
}