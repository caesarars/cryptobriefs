export const metadata = {
  title: "Crypto news sentiment — fast signal | CryptoBriefs",
  description: "Scan crypto news sentiment and market mood quickly. Filter by coin and timeframe. Not financial advice.",
  alternates: { canonical: "https://cryptobriefs.net/lp/news" },
};

export default function NewsLanding() {
  return (
    <div className="min-vh-100" style={{ background: "#000", color: "#fff" }}>
      <div className="container py-5" style={{ maxWidth: 980 }}>
        <div className="text-center mb-4">
          <div className="text-uppercase" style={{ letterSpacing: 3, opacity: 0.7, fontSize: 12 }}>
            CryptoBriefs • News
          </div>
          <h1 className="mt-3" style={{ fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
            Crypto news sentiment — fast signal
          </h1>
          <p className="mt-3" style={{ color: "#94a3b8", fontSize: 18 }}>
            See the market mood at a glance. Filter by coin and timeframe, then read the headlines driving sentiment.
          </p>
        </div>

        <div className="row g-4 align-items-stretch justify-content-center">
          <div className="col-12 col-md-6">
            <div className="p-4 rounded-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>What you can do</h2>
              <ul style={{ marginTop: 12, color: "#cbd5e1" }}>
                <li><b>Filter</b> by coin (BTC, ETH, etc.)</li>
                <li><b>Choose</b> timeframe (today / week / month)</li>
                <li><b>Skim</b> bullish / bearish / neutral counts</li>
                <li><b>Read</b> the headlines behind the mood</li>
              </ul>
              <div className="mt-3" style={{ color: "#64748b", fontSize: 13 }}>
                Not financial advice.
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-4 rounded-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Go to News</h2>
              <p className="mt-2" style={{ color: "#94a3b8" }}>
                Use the sentiment dashboard and browse latest stories.
              </p>
              <a
                href="/news"
                className="btn btn-primary mt-2"
                style={{ borderRadius: 999, padding: "12px 18px", fontWeight: 700 }}
              >
                Open News Sentiment →
              </a>

              <div className="mt-4" style={{ color: "#64748b", fontSize: 13 }}>
                Want a daily summary instead? <a href="/lp/brief" style={{ color: "#67e8f9" }}>Get the brief</a>.
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-5" style={{ color: "#94a3b8", fontSize: 14 }}>
          Looking for education? Browse <a href="/blogs" style={{ color: "#67e8f9" }}>blog</a>.
        </div>
      </div>
    </div>
  );
}
