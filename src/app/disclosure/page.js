export const metadata = {
  title: "Disclosure | CryptoBriefs",
  description: "Affiliate and sponsorship disclosure for CryptoBriefs. We disclose all affiliate links and sponsored content clearly.",
  alternates: {
    canonical: "https://cryptobriefs.net/disclosure",
  },
  openGraph: {
    title: "Disclosure | CryptoBriefs",
    description: "Affiliate and sponsorship disclosure for CryptoBriefs. We disclose all affiliate links and sponsored content clearly.",
    url: "https://cryptobriefs.net/disclosure",
    siteName: "CryptoBriefs",
    images: [{ url: "https://cryptobriefs.net/og-image.svg", width: 1200, height: 630, alt: "CryptoBriefs" }],
    type: "website",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function DisclosurePage() {
  return (
    <div className="container py-5">
      <h1 className="space-title">Disclosure</h1>
      <p className="mt-3" style={{ maxWidth: 860, color: "#4b4b4b" }}>
        CryptoBriefs may use affiliate links and may publish sponsored content.
        When we do, we disclose it clearly.
      </p>

      <h2 className="h4 mt-4">Affiliate links</h2>
      <p style={{ color: "#4b4b4b" }}>
        Some links may be affiliate links. If you click and take action, we may earn a commission
        at no extra cost to you.
      </p>

      <h2 className="h4 mt-4">Sponsored content</h2>
      <p style={{ color: "#4b4b4b" }}>
        Sponsored content is labeled as sponsored. We avoid misleading offers and reserve the
        right to decline sponsors.
      </p>

      <h2 className="h4 mt-4">Not financial advice</h2>
      <p style={{ color: "#4b4b4b" }}>
        CryptoBriefs content is for informational purposes only and is not financial advice.
      </p>
    </div>
  );
}
