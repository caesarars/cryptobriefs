export const metadata = {
  title: "Terms of Service | CryptoBriefs",
  description: "Terms of service for CryptoBriefs. By using cryptobriefs.net you agree to these terms. Content is for informational purposes only and not financial advice.",
  alternates: {
    canonical: "https://cryptobriefs.net/terms",
  },
  openGraph: {
    title: "Terms of Service | CryptoBriefs",
    description: "Terms of service for CryptoBriefs. Content is for informational purposes only and not financial advice.",
    url: "https://cryptobriefs.net/terms",
    siteName: "CryptoBriefs",
    images: [{ url: "https://cryptobriefs.net/og-image.svg", width: 1200, height: 630, alt: "CryptoBriefs" }],
    type: "website",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="container py-5">
      <h1 className="space-title">Terms of Service</h1>
      <p className="mt-3" style={{ maxWidth: 900, color: "#4b4b4b" }}>
        By accessing or using cryptobriefs.net, you agree to these Terms.
      </p>

      <h2 className="h4 mt-4">Not financial advice</h2>
      <p style={{ color: "#4b4b4b" }}>
        CryptoBriefs provides information for educational purposes only and does not provide
        financial, legal, or investment advice. You are responsible for your own decisions.
      </p>

      <h2 className="h4 mt-4">Content</h2>
      <p style={{ color: "#4b4b4b" }}>
        We try to keep information accurate, but we make no guarantees. Content may change or
        be removed at any time.
      </p>

      <h2 className="h4 mt-4">Acceptable use</h2>
      <ul style={{ color: "#4b4b4b" }}>
        <li>Do not misuse the site or attempt to disrupt it.</li>
        <li>Do not scrape or reproduce content at scale without permission.</li>
        <li>Do not use the site for unlawful purposes.</li>
      </ul>

      <h2 className="h4 mt-4">Third-party links</h2>
      <p style={{ color: "#4b4b4b" }}>
        The site may link to third-party websites. We are not responsible for third-party
        content or practices.
      </p>

      <h2 className="h4 mt-4">Contact</h2>
      <p style={{ color: "#4b4b4b" }}>
        Questions? Email us at <a href="mailto:hello@cryptobriefs.net">hello@cryptobriefs.net</a>.
      </p>
    </div>
  );
}
