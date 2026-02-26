import NewsClient from "./NewsClient";

export const metadata = {
  title: "Crypto News | CryptoBriefs",
  description: "Latest crypto news with sentiment scoring. Filter by coin, sentiment, and topics. Stay on top of Bitcoin, Ethereum, and the broader market.",
  keywords: ["crypto news", "bitcoin news", "ethereum news", "cryptocurrency headlines", "crypto sentiment", "blockchain news"],
  alternates: {
    canonical: "https://cryptobriefs.net/news",
  },
  openGraph: {
    title: "Crypto News | CryptoBriefs",
    description: "Scan crypto headlines with sentiment signal. Filter by coin, topic, and sentiment direction.",
    url: "https://cryptobriefs.net/news",
    siteName: "CryptoBriefs",
    images: [{ url: "https://cryptobriefs.net/og-image.png", width: 1200, height: 630, alt: "CryptoBriefs News" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto News | CryptoBriefs",
    description: "Scan crypto headlines with sentiment signal. Filter by coin, topic, and sentiment direction.",
    images: ["https://cryptobriefs.net/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function NewsPage() {
  return <NewsClient />;
}

