export type Bookmark = {
  id: string; // 🔑 URL
  headline: string;
  summary: string;
  source: string;
  image: string;
  url: string;
};

const KEY = "bulletin_x_bookmarks";

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function isBookmarked(id: string) {
  return getBookmarks().some((b) => b.id === id);
}

export function toggleBookmark(article: Bookmark) {
  const bookmarks = getBookmarks();
  const exists = bookmarks.find((b) => b.id === article.id);

  const updated = exists
    ? bookmarks.filter((b) => b.id !== article.id)
    : [...bookmarks, article];

  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
