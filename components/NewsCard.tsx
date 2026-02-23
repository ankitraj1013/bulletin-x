"use client";

import { useEffect, useRef, useState, memo } from "react";
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

function NewsCardComponent({
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

  const handleBookmark = () => {
    toggleBookmark({ id, image, headline, summary, source, url });
    setSaved(isBookmarked(id));
    navigator.vibrate?.(8);
  };

  /* ---------------- WHATSAPP SHARE ONLY ---------------- */

  const handleWhatsAppShare = () => {
    if (!url) return;

    const safeUrl = url.startsWith("http") ? url : `https://${url}`;
    const text = encodeURIComponent(`${headline}\n\n${safeUrl}`);

    const whatsappLink = `https://wa.me/?text=${text}`;

    window.open(whatsappLink, "_blank");
  };

  const handleOpen = () => {
    const safeUrl = url?.startsWith("http") ? url : `https://${url}`;
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative h-full w-full bg-black text-white overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={headline}
          fill
          loading="eager"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-6 pt-16 pb-28">

        <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">
          {source}
        </p>

        <h1 className="text-2xl font-bold leading-tight mb-4">
          {headline}
        </h1>

        <p className="text-sm text-gray-300 leading-relaxed line-clamp-6">
          {summary}
        </p>

        <div className="mt-auto flex justify-between items-center pt-6">

          <button
            onClick={handleOpen}
            className="text-sm font-semibold text-indigo-400"
          >
            Read Full Story →
          </button>

          <div className="flex items-center gap-6">

            {/* BOOKMARK */}
            <button onClick={handleBookmark}>
              {saved ? (
                <BookmarkCheck size={24} className="text-indigo-500" />
              ) : (
                <Bookmark size={24} className="text-gray-300" />
              )}
            </button>

            {/* WHATSAPP ICON (Latest Flat Style) */}
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

export default memo(NewsCardComponent);