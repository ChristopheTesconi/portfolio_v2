import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Christophe Tesconi - Développeur Web Fullstack",
  description: "Solutions web sur-mesure pour PME suisses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Favicon */}
        <link
          rel="icon"
          href="/favicon_512x512.png"
          sizes="512x512"
          type="image/png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f2039" />

        {/* Bootstrap Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
