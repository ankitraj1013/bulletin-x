"use client";

export default function NewsCard({
  image,
  headline,
  summary,
  source,
}: any) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-black fade-card">
      <div className="flex-1 px-3 py-1">
        <div className="h-56 mb-3 overflow-hidden">
          <img
            src={image}
            alt="news"
            className="h-full w-full object-cover parallax-image"
          />
        </div>

        <h2 className="font-bold text-lg mb-3">
          {headline}
        </h2>

        <p className="text-gray-700 dark:text-gray-300">
          {summary}
        </p>

        <p className="text-xs text-gray-500 mt-3">
          Source: {source}
        </p>
      </div>
    </div>
  );
}
