import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GNEWS_API_KEY;

  const url = `https://gnews.io/api/v4/top-headlines?country=in&lang=en&max=30&apikey=${apiKey}`;

  const res = await fetch(url, {
    next: { revalidate: 300 }, // cache 5 minutes
  });

  const data = await res.json();

  if (!data.articles) {
    return NextResponse.json([]);
  }

  const articles = data.articles
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
}
