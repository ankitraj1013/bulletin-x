import { NextResponse } from "next/server";

export const revalidate = 60; // cache for 60 seconds

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

const BULLETIN_CATEGORIES = [
  "general",
  "world",
  "business",
  "technology",
  "sports",
  "entertainment",
];

const MAX_PER_PAGE = 10;
const TARGET_COUNT = 60; // reduced for speed

/* ---------------- FETCH ONE CATEGORY ---------------- */

async function fetchCategory(category: string) {
  const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=${MAX_PER_PAGE}&apikey=${GNEWS_API_KEY}`;

  const res = await fetch(url, {
    next: { revalidate: 60 }, // enable Next.js caching
  });

  if (!res.ok) return [];

  const data = await res.json();

  if (!Array.isArray(data.articles)) return [];

  return data.articles
    .filter((a: any) => a.image && a.title && a.url)
    .map((a: any) => ({
      id: a.url,
      image: a.image,
      headline: a.title,
      summary: a.description || "",
      source: a.source?.name || "Unknown",
      url: a.url,
      category,
      publishedAt: a.publishedAt,
    }));
}

/* ---------------- API HANDLER ---------------- */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "Bulletin-X";

  try {
    /* 🔥 HOME FEED */
    if (category === "Bulletin-X") {
      const batches = await Promise.all(
        BULLETIN_CATEGORIES.map((c) => fetchCategory(c))
      );

      const merged = batches.flat();

      // Deduplicate by URL
      const unique = Array.from(
        new Map(merged.map((a) => [a.url, a])).values()
      );

      return NextResponse.json(unique.slice(0, TARGET_COUNT));
    }

    /* 🔹 SINGLE CATEGORY */
    const normalArticles = await fetchCategory(category);
    return NextResponse.json(normalArticles);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}