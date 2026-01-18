import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GNEWS_API_KEY" },
      { status: 500 }
    );
  }

  const url = `https://gnews.io/api/v4/top-headlines?country=in&lang=en&max=30&apikey=${apiKey}`;

  try {
    const res = await fetch(url, {
      headers: {
        // 🔑 Required for GNews on Vercel / serverless
        "User-Agent": "Bulletin-X/1.0",
        "Accept": "application/json",
      },
      cache: "no-store", // avoid stale cache
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: text },
        { status: res.status }
      );
    }

    const data = await res.json();

    const articles = (data.articles || [])
      .filter(
        (a: any) =>
          a.title &&
          a.description &&
          a.image &&
          a.source?.name &&
          a.url
      )
      .map((a: any) => ({
        // 🔑 STABLE ID → bookmarks & share NEVER break
        id: a.url,

        category: "Bulletin-X",

        image: a.image,

        // Inshorts rule
        headline: a.title.split(" ").slice(0, 20).join(" "),
        summary: a.description.split(" ").slice(0, 70).join(" "),

        source: a.source.name,
        url: a.url,
      }));

    return NextResponse.json(articles);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch news" },
      { status: 500 }
    );
  }
}
