import BriefSlugClient from "./BriefSlugClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Daily Crypto Brief";

  return {
    title: `${title} | CryptoBriefs`,
    description: `Read the ${title} — a concise daily crypto brief covering market sentiment, key movers, and what matters today.`,
    alternates: {
      canonical: `https://cryptobriefs.net/brief/${slug}`,
    },
    openGraph: {
      title: `${title} | CryptoBriefs`,
      description: `Read the ${title} — a concise daily crypto brief covering market sentiment, key movers, and what matters today.`,
      url: `https://cryptobriefs.net/brief/${slug}`,
      siteName: "CryptoBriefs",
      images: [{ url: "https://cryptobriefs.net/og-image.svg", width: 1200, height: 630, alt: "CryptoBriefs" }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | CryptoBriefs`,
      description: `Read the ${title} — a concise daily crypto brief covering market sentiment and key movers.`,
      images: ["https://cryptobriefs.net/og-image.svg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function BriefSlugPage() {
  return <BriefSlugClient />;
}
