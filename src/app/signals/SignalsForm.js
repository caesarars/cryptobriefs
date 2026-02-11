"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "../lib/analytics";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE
  ? `${process.env.NEXT_PUBLIC_API_BASE}/api/signals`
  : "https://ces.dbrata.my.id/api/signals";

const SignalsForm = () => {
  const [email, setEmail] = useState("");
  const [watchlist, setWatchlist] = useState("BTC,ETH");
  const [minScore, setMinScore] = useState(3);
  const [cooldownHours, setCooldownHours] = useState(6);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [latestSignals, setLatestSignals] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const watchlistArray = useMemo(() => {
    return watchlist
      .split(",")
      .map((item) => item.trim().toUpperCase())
      .filter(Boolean);
  }, [watchlist]);

  useEffect(() => {
    trackEvent("view_signals_dashboard");
    fetchLatestSignals();
  }, []);

  const fetchLatestSignals = async () => {
    try {
      const response = await fetch(`${API_BASE}/latest?limit=10`);
      const data = await response.json();
      setLatestSignals(data.data || []);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    trackEvent("signals_subscribe_submit");

    try {
      const response = await fetch(`${API_BASE}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          watchlist: watchlistArray,
          minScore: Number(minScore),
          cooldownHours: Number(cooldownHours),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Subscription failed.");
      }

      setStatus("success");
      setMessage("Preferences saved. Alerts will arrive when signals trigger.");
      trackEvent("signals_subscribe_success");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Try again.");
      trackEvent("signals_subscribe_error");
    }
  };

  const handleLoadPreferences = async () => {
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/preferences?email=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      const pref = data?.data;
      if (pref) {
        setWatchlist((pref.watchlist || []).join(","));
        setMinScore(pref.minScore ?? 3);
        setCooldownHours(pref.cooldownHours ?? 6);
        setMessage("Preferences loaded.");
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setMessage("Could not load preferences. Make sure you are subscribed.");
    }
  };

  const handleLoadAlerts = async () => {
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/alerts?email=${encodeURIComponent(email)}&limit=10`);
      const data = await response.json();
      setAlerts(data.data || []);
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <form className="signals-form" onSubmit={handleSubmit}>
        <label className="signals-field">
          Email
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            className="signals-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="signals-field">
          Watchlist (comma separated)
          <input
            type="text"
            name="watchlist"
            placeholder="BTC,ETH,SOL"
            className="signals-input"
            value={watchlist}
            onChange={(event) => setWatchlist(event.target.value)}
          />
        </label>

        <div className="signals-grid">
          <label className="signals-field">
            Min Score
            <input
              type="number"
              min="1"
              max="10"
              className="signals-input"
              value={minScore}
              onChange={(event) => setMinScore(event.target.value)}
            />
          </label>
          <label className="signals-field">
            Cooldown (hours)
            <input
              type="number"
              min="1"
              max="48"
              className="signals-input"
              value={cooldownHours}
              onChange={(event) => setCooldownHours(event.target.value)}
            />
          </label>
        </div>

        <div className="signals-actions">
          <button type="submit" className="signals-button" disabled={status === "loading"}>
            {status === "loading" ? "Saving..." : "Save preferences"}
          </button>
          <button type="button" className="signals-button ghost" onClick={handleLoadPreferences}>
            Load preferences
          </button>
          <button type="button" className="signals-button ghost" onClick={handleLoadAlerts}>
            View my alerts
          </button>
        </div>

        {message ? (
          <p className={status === "success" ? "signals-message success" : "signals-message error"}>
            {message}
          </p>
        ) : null}
      </form>

      <div className="signals-section">
        <h2>Latest Signals</h2>
        {latestSignals.length === 0 ? (
          <p className="signals-muted">No signals yet.</p>
        ) : (
          <ul className="signals-list">
            {latestSignals.map((signal) => (
              <li key={signal._id}>
                <strong>{signal.symbol}</strong> — score {signal.score}
                <div className="signals-reasons">
                  {(signal.reasons || []).slice(0, 3).join(" • ")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="signals-section">
        <h2>My Recent Alerts</h2>
        {alerts.length === 0 ? (
          <p className="signals-muted">No alerts yet. Enter email and click “View my alerts”.</p>
        ) : (
          <ul className="signals-list">
            {alerts.map((alert) => (
              <li key={alert._id}>
                <strong>{alert.symbol}</strong> — score {alert.score}
                <div className="signals-reasons">
                  {(alert.reasons || []).slice(0, 3).join(" • ")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SignalsForm;
