import Link from "next/link";

export const metadata = {
  title: "Advertise | CryptoBriefs",
  description: "Sponsor CryptoBriefs newsletter placements and reach engaged crypto readers. Newsletter sponsorships, sponsored articles, and banner placements available.",
  alternates: {
    canonical: "https://cryptobriefs.net/advertise",
  },
  openGraph: {
    title: "Advertise | CryptoBriefs",
    description: "Reach engaged crypto readers through CryptoBriefs newsletter sponsorships and banner placements.",
    url: "https://cryptobriefs.net/advertise",
    siteName: "CryptoBriefs",
    images: [{ url: "https://cryptobriefs.net/og-image.png", width: 1200, height: 630, alt: "CryptoBriefs" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advertise | CryptoBriefs",
    description: "Reach engaged crypto readers through CryptoBriefs newsletter sponsorships and banner placements.",
    images: ["https://cryptobriefs.net/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },


  other: {
    "og:logo": "/favicon.png",
  }};

export default function AdvertisePage() {
  return (
    <div className="container py-5">
      <h1 className="space-title">Advertise on CryptoBriefs</h1>
      <p className="mt-3" style={{ maxWidth: 820, color: "#4b4b4b" }}>
        Want to sponsor a placement in the CryptoBriefs newsletter or website?
        We keep it simple: clear formats, transparent expectations, and no scammy offers.
      </p>

      <div className="row g-3 mt-2">
        <div className="col-12 col-md-4">
          <div className="p-4 rounded-4" style={{ background: "#f6f2fb" }}>
            <div className="fw-bold">Newsletter sponsorship</div>
            <div className="mt-2" style={{ color: "#4b4b4b" }}>
              One sponsor slot in the daily/weekly brief.
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="p-4 rounded-4" style={{ background: "#f6f2fb" }}>
            <div className="fw-bold">Sponsored article</div>
            <div className="mt-2" style={{ color: "#4b4b4b" }}>
              Educational content with clear disclosure.
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="p-4 rounded-4" style={{ background: "#f6f2fb" }}>
            <div className="fw-bold">Banner placements</div>
            <div className="mt-2" style={{ color: "#4b4b4b" }}>
              Limited banner ads (no popups).
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-4" style={{ background: "#0b0b0f", color: "#fff" }}>
        <div className="fw-bold" style={{ fontSize: "1.1rem" }}>
          Contact
        </div>
        <div className="mt-2" style={{ opacity: 0.9 }}>
          Email: <a href="mailto:admin@cryptobriefs.net">admin@cryptobriefs.net</a>
        </div>
        <div className="mt-3 d-flex gap-2 flex-wrap">
          <Link className="btn btn-glow" href="/subscribe">Subscribe</Link>
          <Link className="btn btn-outline-light" style={{ borderRadius: 50 }} href="/">Home</Link>
        </div>
      </div>

      <p className="mt-4" style={{ color: "#6b7280" }}>
        We do not accept misleading promotions. All sponsorships are disclosed.
      </p>
    </div>
  );
}

