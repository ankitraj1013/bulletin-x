import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-100 text-black dark:bg-black dark:text-white">
        {children}
      </body>
    </html>
  );
}
