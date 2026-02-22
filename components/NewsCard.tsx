"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleBookmark, isBookmarked } from "@/utils/bookmarks";
import { saveSignal } from "@/lib/feedSignals";

interface NewsCardProps {
  id: string;
  image: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  category?: string;
}

export default function NewsCard({
  id,
  image,
  headline,
  summary,
  source,
  url,
  category = "general",
}: NewsCardProps) {
  const [saved, setSaved] = useState(false);
  const viewStart = useRef<number>(0);

  /* ---------------- INITIALIZE ---------------- */

  useEffect(() => {
    setSaved(isBookmarked(id));
    viewStart.current = Date.now();

    return () => {
      saveSignal({
        articleId: id,
        category,
        source,
        viewedAt: Date.now(),
        dwellTime: Date.now() - viewStart.current,
      });
    };
  }, [id, category, source]);

  /* ---------------- BOOKMARK ---------------- */

  const handleBookmark = () => {
    toggleBookmark({ id, image, headline, summary, source, url });
    setSaved(isBookmarked(id));
  };

  /* ---------------- WHATSAPP SHARE ---------------- */

  const handleWhatsAppShare = () => {
    if (!url) return;

    const safeUrl = url.startsWith("http") ? url : `https://${url}`;
    const text = encodeURIComponent(`${headline}\n\n${safeUrl}`);

    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  /* ---------------- READ MORE ---------------- */

  const handleOpen = () => {
    if (!url) return;

    const safeUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(safeUrl, "_blank");
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="h-full w-full flex flex-col bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">

      {/* IMAGE */}
      <div className="relative h-64 w-full">
        <Image
          src={image}
          alt={headline}
          fill
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyMxMTEyMTQnLz48L3N2Zz4="
          className="object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col px-6 py-5">

        <h2 className="text-xl font-semibold mb-3 line-clamp-3">
          {headline}
        </h2>

        <p className="text-zinc-300 text-sm line-clamp-5">
          {summary}
        </p>

        <p className="text-xs text-zinc-500 mt-4 uppercase tracking-wide">
          {source}
        </p>

        {/* ACTION ROW */}
        <div className="mt-auto pt-5 flex justify-between items-center">

          {/* READ MORE */}
          <button
            onClick={handleOpen}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition"
          >
            Read more →
          </button>

          <div className="flex items-center gap-5">

            {/* BOOKMARK */}
            <button
              onClick={handleBookmark}
              className="transition-transform duration-200 active:scale-90"
            >
              {saved ? (
                <BookmarkCheck
                  size={22}
                  className="text-indigo-500 scale-110 transition"
                />
              ) : (
                <Bookmark
                  size={22}
                  className="text-zinc-300 hover:text-white transition"
                />
              )}
            </button>

            {/* OFFICIAL WHATSAPP CIRCLE LOGO */}
            <button
  onClick={handleWhatsAppShare}
  className="transition transform hover:scale-110"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="22"
    height="22"
    fill="#25D366"
  >
    <path d="M16.002 3C9.374 3 4 8.372 4 15c0 2.645.861 5.093 2.323 7.078L4 29l7.157-2.273A11.94 11.94 0 0016.002 27C22.63 27 28 21.628 28 15S22.63 3 16.002 3zm0 21.5c-1.91 0-3.694-.56-5.19-1.52l-.37-.23-4.245 1.35 1.38-4.13-.24-.38A9.43 9.43 0 016.5 15c0-5.24 4.26-9.5 9.502-9.5C21.24 5.5 25.5 9.76 25.5 15s-4.26 9.5-9.498 9.5zm5.2-7.1c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.21-.6.07-.28-.14-1.18-.43-2.25-1.38-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.83-2.02-.22-.53-.44-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.28-.96.94-.96 2.3 0 1.36.98 2.68 1.12 2.87.14.18 1.94 2.96 4.7 4.14.66.28 1.18.45 1.58.58.66.21 1.27.18 1.75.11.53-.08 1.65-.67 1.88-1.31.23-.64.23-1.19.16-1.31-.07-.11-.25-.18-.53-.32z"/>
  </svg>
</button>

          </div>
        </div>

      </div>
    </div>
  );
}