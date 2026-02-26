import BriefIndexClient from "./BriefIndexClient";

export const metadata = {
  title: "Today's Crypto Brief | CryptoBriefs",
  description: "Your daily 60-second crypto brief: market snapshot, sentiment highlights, and the top movers. Understand what matters in crypto today.",
  keywords: ["crypto brief", "daily crypto summary", "bitcoin today", "crypto market update", "crypto digest"],
  alternates: {
    canonical: "https://cryptobriefs.net/brief",
  },
  openGraph: {
    title: "Today's Crypto Brief | CryptoBriefs",
    description: "Your daily 60-second crypto brief: market snapshot, sentiment highlights, and the top movers.",
    url: "https://cryptobriefs.net/brief",
    siteName: "CryptoBriefs",
    images: [{ url: "https://cryptobriefs.net/og-image.png", width: 1200, height: 630, alt: "CryptoBriefs Daily Brief" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Today's Crypto Brief | CryptoBriefs",
    description: "Your daily 60-second crypto brief: market snapshot, sentiment highlights, and the top movers.",
    images: ["https://cryptobriefs.net/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BriefPage() {
  return <BriefIndexClient />;
}

