import "./Signals.css";
import SignalsForm from "./SignalsForm";
import AffiliateBar from "@/app/component/AffiliateBar";

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
};

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
        </div>

        <SignalsForm />

        <p className="signals-footnote">
          You can unsubscribe anytime. Alerts are sent to your email.
        </p>

        {/* Affiliate CTAs — act on your signals */}
        <div className="signals-affiliate-row">
          <AffiliateBar
            href="https://partner.bybit.com/b/aff_13915_123677"
            badge="⚡"
            title="Act on your signals instantly"
            sub="Trade crypto with low fees on Bybit"
            cta="Trade on Bybit →"
            theme="orange"
          />
          <AffiliateBar
            href="https://www.tradingview.com/"
            badge="📊"
            title="Chart your signals on TradingView"
            sub="Professional-grade charts trusted by 50M+ traders"
            cta="Try TradingView →"
            theme="blue"
            disclaimer="Partner link"
          />
        </div>
      </div>
    </div>
  );
};

export default SignalsPage;
