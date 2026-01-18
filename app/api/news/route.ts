import { NextResponse } from "next/server";

const CATEGORY_MAP: Record<string, string> = {
  "Bulletin-X": "",
  Trending: "topic=breaking-news",
  Sports: "topic=sports",
  Tech: "topic=technology",
  Entertainment: "topic=entertainment",
  Global: "country=us",
  Memes: "q=memes OR viral",
};

export async function GET(req: Request) {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GNEWS_API_KEY" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "Bulletin-X";

  const categoryQuery =
    CATEGORY_MAP[category] ?? "";

  const baseUrl = "https://gnews.io/api/v4/top-headlines";

  const url = `${baseUrl}?lang=en&max=30&apikey=${apiKey}&${categoryQuery}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Bulletin-X/1.0",
        Accept: "application/json",
      },
      cache: "no-store",
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
        id: a.url, // ✅ stable
        category,
        image: a.image,
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
