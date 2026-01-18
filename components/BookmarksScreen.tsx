"use client";

import { useEffect, useState } from "react";
import { getBookmarks, toggleBookmark, Bookmark } from "../utils/bookmarks";

type Props = {
  onBack: () => void;
};

export default function BookmarksScreen({ onBack }: Props) {
  const [items, setItems] = useState<Bookmark[]>([]);

  useEffect(() => {
    setItems(getBookmarks());
  }, []);

  const remove = (item: Bookmark) => {
    toggleBookmark(item);
    setItems(getBookmarks());
  };

  return (
    <div className="h-full bg-white dark:bg-black p-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="text-blue-600 dark:text-blue-400"
        >
          ← Back
        </button>
        <h2 className="font-bold text-lg">Bookmarks</h2>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400 mt-10 text-center">
          No bookmarks yet
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((b) => (
            <div
              key={b.id}
              className="border-b pb-3 border-gray-200 dark:border-gray-800"
            >
              <p className="font-semibold">{b.headline}</p>
              <p className="text-xs text-gray-500">{b.source}</p>

              <button
                onClick={() => remove(b)}
                className="text-xs text-red-500 mt-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
