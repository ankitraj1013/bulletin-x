import "./globals.css";

export const metadata = {
  title: "Bulletin-X",
  description: "Short, fast and reliable news",
  manifest: "/manifest.json",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-black">
        {children}
      </body>
    </html>
  );
}
