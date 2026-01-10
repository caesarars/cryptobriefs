import "./Subscribe.css";
import SubscribeForm from "./SubscribeForm";

export const metadata = {
  title: "Join the Newsletter | CryptoBriefs",
  description: "Get weekly crypto briefings, curated signals, and new opportunities.",
};

const SubscribePage = () => {
  return (
    <div className="subscribe-page">
      <div className="subscribe-card">
        <p className="subscribe-label">CryptoBriefs Newsletter</p>
        <h1 className="subscribe-title">Join the newsletter</h1>
        <p className="subscribe-subtitle">
          Weekly crypto briefings, signal digests, and market insights. No spam,
          unsubscribe anytime.
        </p>
        <SubscribeForm />
        <p className="subscribe-footnote">
          By subscribing, you agree to receive CryptoBriefs updates.
        </p>
      </div>
    </div>
  );
};

export default SubscribePage;
