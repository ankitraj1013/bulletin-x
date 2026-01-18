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
        // 🔑 REQUIRED by GNews on Vercel
        "User-Agent": "Bulletin-X/1.0",
      },
      cache: "no-store", // avoid stale edge cache
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
      .map((a: any, index: number) => ({
        id: index + 1,
        category: "Bulletin-X",
        image: a.image,
        headline: a.title.split(" ").slice(0, 20).join(" "),
        summary: a.description.split(" ").slice(0, 70).join(" "),
        source: a.source.name,
        url: a.url,
      }));

    return NextResponse.json(articles);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
