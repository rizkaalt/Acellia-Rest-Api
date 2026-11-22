import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acellia REST API",
  description: "Download media sosial semudah sihir.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body className="min-h-screen star-pattern">{children}</body>
    </html>
  );
}
