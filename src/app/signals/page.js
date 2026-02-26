import "./Signals.css";
import SignalsForm from "./SignalsForm";

export const metadata = {
  title: "Signal Alerts | CryptoBriefs",
  description: "Manage your CryptoBriefs signal alerts, watchlist, and notification settings. Set score thresholds and get notified on key market moves.",
  alternates: {
    canonical: "https://cryptobriefs.net/signals",
  },
  openGraph: {
    title: "Signal Alerts | CryptoBriefs",
    description: "Manage your crypto signal alerts, watchlist, and notification settings on CryptoBriefs.",
    url: "https://cryptobriefs.net/signals",
    siteName: "CryptoBriefs",
    images: [{ url: "https://cryptobriefs.net/og-image.png", width: 1200, height: 630, alt: "CryptoBriefs Signal Alerts" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Signal Alerts | CryptoBriefs",
    description: "Manage your crypto signal alerts, watchlist, and notification settings on CryptoBriefs.",
    images: ["https://cryptobriefs.net/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },


  other: {
    "og:logo": "/favicon.png",
  }};

const SignalsPage = () => {
  return (
    <div className="signals-page">
      <div className="signals-card">
        <div className="signals-header">
          <div>
            <p className="signals-label">CryptoBriefs Signals</p>
            <h1 className="signals-title">Signal Alerts Dashboard</h1>
            <p className="signals-subtitle">
              Customize your watchlist, score threshold, and cooldown.
            </p>
          </div>
          <div className="signals-badge">Premium Signal UI</div>
        </div>

        <SignalsForm />

        <p className="signals-footnote">
          You can unsubscribe anytime. Alerts are sent to your email.
        </p>
      </div>
    </div>
  );
};

export default SignalsPage;

