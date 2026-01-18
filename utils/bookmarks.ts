export type Bookmark = {
  id: number;
  headline: string;
  summary: string;
  source: string;
  image: string;
};

const KEY = "bulletin_x_bookmarks";

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function isBookmarked(id: number) {
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
