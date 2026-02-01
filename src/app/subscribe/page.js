import "./Subscribe.css";
import SubscribeForm from "./SubscribeForm";

export const metadata = {
  title: "Subscribe | CryptoBriefs",
  description: "Get the 60‑second crypto brief: sentiment + movers + one clear takeaway. Free. No spam.",
};

const SubscribePage = () => {
  return (
    <div className="subscribe-page">
      <div className="subscribe-card">
        <p className="subscribe-label">CryptoBriefs Newsletter</p>
        <h1 className="subscribe-title">Get the 60‑second crypto brief</h1>
        <p className="subscribe-subtitle">
          Daily signal, without the noise. You’ll get:
        </p>
        <ul className="subscribe-benefits">
          <li><strong>Sentiment snapshot</strong> (BTC + market mood)</li>
          <li><strong>Top movers</strong> and what’s driving them</li>
          <li><strong>One clear takeaway</strong> you can act on</li>
        </ul>
        <SubscribeForm />
        <p className="subscribe-footnote">
          Free. Unsubscribe anytime. By subscribing, you agree to receive CryptoBriefs updates.
        </p>
      </div>
    </div>
  );
};

export default SubscribePage;
