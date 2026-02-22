import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bulletin-X",
    template: "%s | Bulletin-X",
  },
  description: "Short, fast and reliable swipe-based news platform.",
};

export function generateViewport(): Viewport {
  return {
    themeColor: "#000000",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
