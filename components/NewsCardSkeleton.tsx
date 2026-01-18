"use client";

export default function NewsCardSkeleton() {
  return (
    <div className="h-full w-full bg-white dark:bg-black animate-pulse">
      <div className="h-56 bg-gray-300 dark:bg-gray-800" />

      <div className="p-4 space-y-4">
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
      </div>
    </div>
  );
}
