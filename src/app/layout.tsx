import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer, Header, Ticker } from "@/components/stitch";
import { StoreProvider } from "@/components/store";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: { default: "The General Edit", template: "%s | The General Edit" },
  description: "Good things. Strange things. Everyday things.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-cream">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Space+Grotesk:wght@500;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink antialiased">
        <StoreProvider>
          <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
          <Ticker />
          <Header />
          <main className="flex-1" id="main">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
