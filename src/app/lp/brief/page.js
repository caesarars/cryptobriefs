import SubscribeForm from "@/app/subscribe/SubscribeForm";

export const metadata = {
  title: "Get the 60-second crypto brief | CryptoBriefs",
  description: "Daily signal without the noise: sentiment snapshot, top movers, and one clear takeaway. Free. Unsubscribe anytime.",
  alternates: { canonical: "https://cryptobriefs.net/lp/brief" },
};

export default function BriefLanding() {
  return (
    <div className="min-vh-100" style={{ background: "#000", color: "#fff" }}>
      <div className="container py-5" style={{ maxWidth: 980 }}>
        <div className="text-center mb-4">
          <div className="text-uppercase" style={{ letterSpacing: 3, opacity: 0.7, fontSize: 12 }}>
            CryptoBriefs Newsletter
          </div>
          <h1 className="mt-3" style={{ fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
            Get the 60-second crypto brief
          </h1>
          <p className="mt-3" style={{ color: "#94a3b8", fontSize: 18 }}>
            Built for busy creators & professionals. Get market mood, top movers, and one clear takeaway — daily.
          </p>
        </div>

        <div className="row g-4 align-items-stretch justify-content-center">
          <div className="col-12 col-md-6">
            <div className="p-4 rounded-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>You’ll get:</h2>
              <ul style={{ marginTop: 12, color: "#cbd5e1" }}>
                <li><b>Sentiment snapshot</b> (BTC + market mood)</li>
                <li><b>Top movers</b> + what’s driving them</li>
                <li><b>One clear takeaway</b> you can act on</li>
              </ul>
              <div className="mt-3" style={{ color: "#64748b", fontSize: 13 }}>
                No spam. Unsubscribe anytime. Not financial advice.
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-4 rounded-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Join free</h2>
              <div className="mt-3">
                <SubscribeForm />
              </div>
              <div className="mt-3" style={{ color: "#64748b", fontSize: 13 }}>
                By subscribing you agree to receive CryptoBriefs updates.
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-5" style={{ color: "#94a3b8", fontSize: 14 }}>
          Prefer the website? Browse <a href="/brief" style={{ color: "#67e8f9" }}>briefs</a> or <a href="/news" style={{ color: "#67e8f9" }}>news</a>.
        </div>
      </div>
    </div>
  );
}
