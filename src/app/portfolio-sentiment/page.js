import PortfolioSentimentClient from "./PortfolioSentimentClient";

const PAGE_URL = "https://cryptobriefs.net/portfolio-sentiment";
const OG_IMAGE = "https://cryptobriefs.net/og-image.svg";

export const metadata = {
  title: "Portfolio Sentiment Tracker",
  description:
    "Track daily crypto portfolio sentiment from real-time headlines. Add coin weights, compute today score, and see top positive and negative news drivers.",
  keywords: [
    "portfolio sentiment",
    "crypto sentiment",
    "bitcoin sentiment",
    "ethereum sentiment",
    "crypto portfolio tracker",
    "news sentiment analysis",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Portfolio Sentiment Tracker | CryptoBriefs",
    description:
      "Measure daily sentiment for your crypto portfolio using headline-driven scoring and per-coin impact breakdowns.",
    url: PAGE_URL,
    siteName: "CryptoBriefs",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "CryptoBriefs Portfolio Sentiment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Sentiment Tracker | CryptoBriefs",
    description:
      "See how recent crypto news affects your portfolio with a daily sentiment score and top drivers.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PortfolioSentimentPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CryptoBriefs Portfolio Sentiment Tracker",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Interactive page to track daily crypto portfolio sentiment score from recent headlines, including per-coin breakdown and positive/negative drivers.",
    publisher: {
      "@type": "Organization",
      name: "CryptoBriefs",
      url: "https://cryptobriefs.net",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioSentimentClient />
    </>
  );
}
