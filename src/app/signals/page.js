import "./Signals.css";
import SignalsForm from "./SignalsForm";

export const metadata = {
  title: "Signal Alerts | CryptoBriefs",
  description: "Manage your CryptoBriefs signal alerts, watchlist, and notification settings.",
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
