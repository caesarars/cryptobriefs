export const metadata = {
  title: "Privacy Policy | CryptoBriefs",
  description: "Privacy policy for CryptoBriefs.",
};

export default function PrivacyPage() {
  return (
    <div className="container py-5">
      <h1 className="space-title">Privacy Policy</h1>
      <p className="mt-3" style={{ maxWidth: 900, color: "#4b4b4b" }}>
        This Privacy Policy explains how CryptoBriefs (\"we\", \"us\") collects, uses, and
        protects information when you use cryptobriefs.net.
      </p>

      <h2 className="h4 mt-4">Information we collect</h2>
      <ul style={{ color: "#4b4b4b" }}>
        <li>
          <strong>Newsletter email</strong> (if you subscribe): we store your email address to
          send the CryptoBriefs newsletter and related updates.
        </li>
        <li>
          <strong>Usage data</strong>: we may collect anonymized analytics (e.g., page views,
          clicks) to improve the site.
        </li>
        <li>
          <strong>Cookies</strong>: we and our partners may use cookies or similar technologies
          for analytics and advertising.
        </li>
      </ul>

      <h2 className="h4 mt-4">How we use information</h2>
      <ul style={{ color: "#4b4b4b" }}>
        <li>To deliver the newsletter and respond to your requests.</li>
        <li>To operate and improve the site.</li>
        <li>To measure performance and conversions.</li>
        <li>To serve and measure ads (e.g., Google AdSense), where enabled.</li>
      </ul>

      <h2 className="h4 mt-4">Third-party advertising (Google AdSense)</h2>
      <p style={{ color: "#4b4b4b" }}>
        We may display ads served by Google and its partners. Google may use cookies to
        personalize ads and measure ad performance. You can learn more about how Google uses
        information from sites that use its services at:
        {" "}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">
          https://policies.google.com/technologies/partner-sites
        </a>
        .
      </p>

      <h2 className="h4 mt-4">Your choices</h2>
      <ul style={{ color: "#4b4b4b" }}>
        <li>You can unsubscribe from emails at any time via the unsubscribe link.</li>
        <li>You can control cookies through your browser settings.</li>
      </ul>

      <h2 className="h4 mt-4">Contact</h2>
      <p style={{ color: "#4b4b4b" }}>
        Questions? Email us at <a href="mailto:hello@cryptobriefs.net">hello@cryptobriefs.net</a>.
      </p>

      <p className="mt-4" style={{ color: "#6b7280" }}>
        Last updated: {new Date().toISOString().slice(0, 10)}
      </p>
    </div>
  );
}
