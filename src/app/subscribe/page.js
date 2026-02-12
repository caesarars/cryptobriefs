import "./Subscribe.css";
import SubscribeForm from "./SubscribeForm";

export const metadata = {
  title: "Subscribe | CryptoBriefs",
  description: "Get the 60‑second crypto brief: sentiment + movers + one clear takeaway. Free. No spam.",
};

const SubscribePage = () => {
  return (
    <div className="subscribe-page">
      <div className="subscribe-shell">
        <div className="subscribe-hero">
          <p className="subscribe-label">CryptoBriefs Newsletter</p>
          <h1 className="subscribe-title">Get the 60-second crypto brief</h1>
          <p className="subscribe-subtitle">
            Daily signal, without the noise. A focused market summary you can read in under a minute.
          </p>

          <ul className="subscribe-benefits">
            <li>
              <span className="benefit-dot">01</span>
              <span><strong>Sentiment snapshot</strong> for BTC and overall market mood.</span>
            </li>
            <li>
              <span className="benefit-dot">02</span>
              <span><strong>Top movers</strong> and the narrative behind the move.</span>
            </li>
            <li>
              <span className="benefit-dot">03</span>
              <span><strong>One clear takeaway</strong> to guide your next decision.</span>
            </li>
          </ul>

          <div className="subscribe-proof">
            <span>Free forever</span>
            <span>No spam</span>
            <span>Unsubscribe anytime</span>
          </div>
        </div>

        <div className="subscribe-card">
          <p className="subscribe-form-title">Join the daily list</p>
          <p className="subscribe-form-subtitle">
            Start receiving your brief straight to your inbox.
          </p>
          <SubscribeForm />
          <p className="subscribe-footnote">
            By subscribing, you agree to receive CryptoBriefs updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;
