import Link from "next/link";

export const metadata = {
  title: "About | CryptoBriefs",
  description: "CryptoBriefs delivers a 60-second daily crypto brief — sentiment, movers, and one clear takeaway. Built for busy people who want signal without the noise.",
  alternates: {
    canonical: "https://cryptobriefs.net/about",
  },
  openGraph: {
    title: "About | CryptoBriefs",
    description: "CryptoBriefs delivers a 60-second daily crypto brief — sentiment, movers, and one clear takeaway.",
    url: "https://cryptobriefs.net/about",
    siteName: "CryptoBriefs",
    images: [{ url: "https://cryptobriefs.net/og-image.png", width: 1200, height: 630, alt: "CryptoBriefs" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | CryptoBriefs",
    description: "CryptoBriefs delivers a 60-second daily crypto brief — sentiment, movers, and one clear takeaway.",
    images: ["https://cryptobriefs.net/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },


  other: {
    "og:logo": "/favicon.png",
  }};

export default function AboutPage() {
  return (
    <div className="container py-5">
      <h1 className="space-title">About CryptoBriefs</h1>
      <p className="mt-3" style={{ maxWidth: 900, color: "#4b4b4b" }}>
        CryptoBriefs is a fast, no-noise crypto newsletter and website. The goal is simple:
        help you understand what matters in crypto in about 60 seconds.
      </p>

      <div className="row g-3 mt-2">
        <div className="col-12 col-md-4">
          <div className="p-4 rounded-4" style={{ background: "#f6f2fb" }}>
            <div className="fw-bold">For busy people</div>
            <div className="mt-2" style={{ color: "#4b4b4b" }}>
              You don’t need 2 hours of scrolling to keep up.
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="p-4 rounded-4" style={{ background: "#f6f2fb" }}>
            <div className="fw-bold">Signals over hype</div>
            <div className="mt-2" style={{ color: "#4b4b4b" }}>
              Sentiment, movers, and one clear takeaway.
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="p-4 rounded-4" style={{ background: "#f6f2fb" }}>
            <div className="fw-bold">Transparent</div>
            <div className="mt-2" style={{ color: "#4b4b4b" }}>
              If we use affiliate links or sponsors, we disclose it.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 d-flex gap-2 flex-wrap">
        <Link href="/subscribe" className="btn btn-glow">Join the newsletter</Link>
        <Link href="/brief" className="btn btn-outline-dark" style={{ borderRadius: 50 }}>Read today</Link>
      </div>

      <p className="mt-4" style={{ color: "#6b7280" }}>
        Not financial advice.
      </p>
    </div>
  );
}

