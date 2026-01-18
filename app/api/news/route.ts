import { NextResponse } from "next/server";

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

const BULLETIN_CATEGORIES = [
  "general",
  "world",
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
  "science",
];

const MAX_PER_PAGE = 10;
const TARGET_COUNT = 100;
const MAX_PAGES = 5;

/* ---------------- FETCH ONE CATEGORY ---------------- */

async function fetchCategory(category: string, page: number) {
  const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=${MAX_PER_PAGE}&page=${page}&apikey=${GNEWS_API_KEY}`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  if (!Array.isArray(data.articles)) return [];

  return data.articles.map((a: any) => ({
    id: a.url, // 🔑 stable id
    image: a.image,
    headline: a.title,
    summary: a.description,
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

  /* 🔥 BULLETIN-X (HOME FEED) */
  if (category === "Bulletin-X") {
    let allArticles: any[] = [];
    let page = 1;

    while (allArticles.length < TARGET_COUNT && page <= MAX_PAGES) {
      const batch = await Promise.all(
        BULLETIN_CATEGORIES.map((c) => fetchCategory(c, page))
      );

      allArticles.push(...batch.flat());
      page++;
    }

    // 🔁 Deduplicate by URL
    const uniqueArticles = Array.from(
      new Map(allArticles.map((a) => [a.url, a])).values()
    );

    return NextResponse.json(uniqueArticles.slice(0, TARGET_COUNT));
  }

  /* 🔹 NORMAL CATEGORY */
  const normalArticles = await fetchCategory(category, 1);
  return NextResponse.json(normalArticles);
}
