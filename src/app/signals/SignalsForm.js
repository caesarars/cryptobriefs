"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { api } from "../lib/backend";

const API_BASE = api("/api/signals");

const SCORE_META = [
  { min: 7, bg: "rgba(56,176,94,0.15)", color: "#15803d", label: "High" },
  { min: 4, bg: "rgba(244,188,22,0.15)", color: "#92400e", label: "Mid" },
  { min: 0, bg: "rgba(255,79,79,0.12)", color: "#b91c1c", label: "Low" },
];

function getScoreMeta(score) {
  return SCORE_META.find((c) => score >= c.min) ?? SCORE_META[2];
}

function formatTime(ts) {
  if (!ts) return null;
  const d = new Date(ts);
  if (isNaN(d)) return null;
  return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}

const SignalsForm = () => {
  const [email, setEmail] = useState("");
  const [watchlist, setWatchlist] = useState("BTC,ETH");
  const [minScore, setMinScore] = useState(3);
  const [cooldownHours, setCooldownHours] = useState(6);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [latestSignals, setLatestSignals] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [prefLoading, setPrefLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);

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
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email first.");
      return;
    }
    setPrefLoading(true);
    setMessage("");
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
    } finally {
      setPrefLoading(false);
    }
  };

  const handleLoadAlerts = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email first.");
      return;
    }
    setAlertsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/alerts?email=${encodeURIComponent(email)}&limit=10`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setAlerts(data.data || []);
    } catch {
      setStatus("error");
      setMessage("Could not load alerts. Make sure you are subscribed.");
    } finally {
      setAlertsLoading(false);
    }
  };

  return (
    <div>
      <form className="signals-form glass" onSubmit={handleSubmit}>
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
          Watchlist
          <span className="signals-field-hint">Comma-separated coin symbols, e.g. BTC,ETH,SOL</span>
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
            Min Score (1–10)
            <span className="signals-field-hint">Alert threshold — higher means stronger signals only</span>
            <input
              type="number"
              min="1"
              max="10"
              className="signals-input"
              value={minScore}
              onChange={(event) => setMinScore(Number(event.target.value))}
            />
          </label>
          <label className="signals-field">
            Cooldown (hours)
            <span className="signals-field-hint">Minimum gap between alerts for the same coin</span>
            <input
              type="number"
              min="1"
              max="48"
              className="signals-input"
              value={cooldownHours}
              onChange={(event) => setCooldownHours(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="signals-actions">
          <button type="submit" className="signals-button" disabled={status === "loading"}>
            {status === "loading" ? "Saving..." : "Save preferences"}
          </button>
          <button
            type="button"
            className="signals-button ghost"
            onClick={handleLoadPreferences}
            disabled={prefLoading}
          >
            {prefLoading ? "Loading..." : "Load preferences"}
          </button>
          <button
            type="button"
            className="signals-button ghost"
            onClick={handleLoadAlerts}
            disabled={alertsLoading}
          >
            {alertsLoading ? "Loading..." : "View my alerts"}
          </button>
        </div>

        {message ? (
          <p
            role="alert"
            className={status === "success" ? "signals-message success" : "signals-message error"}
          >
            {message}
          </p>
        ) : null}
      </form>

      <div className="signals-section glass">
        <div className="signals-section-header">
          <h2>Latest Signals</h2>
          <div className="signals-section-header-actions">
            <button
              className="signals-refresh"
              onClick={fetchLatestSignals}
              aria-label="Refresh signals"
              type="button"
            >
              ↻
            </button>
            <span className="signals-chip">Live</span>
          </div>
        </div>
        {latestSignals.length === 0 ? (
          <p className="signals-muted">No signals yet.</p>
        ) : (
          <ul className="signals-list">
            {latestSignals.map((signal, index) => {
              const { bg, color, label } = getScoreMeta(signal.score);
              const time = formatTime(signal.triggeredAt ?? signal.createdAt);
              return (
                <li key={signal._id ?? index}>
                  <div className="signals-list-row">
                    <strong>{signal.symbol}</strong>
                    <span className="signals-score-badge" style={{ background: bg, color }}>
                      Score {signal.score} · {label}
                    </span>
                    {time ? <span className="signals-time">{time}</span> : null}
                  </div>
                  <div className="signals-reasons">
                    {(signal.reasons || []).slice(0, 3).join(" • ")}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="signals-section glass">
        <div className="signals-section-header">
          <h2>My Recent Alerts</h2>
          <span className="signals-chip muted">History</span>
        </div>
        {alerts.length === 0 ? (
          <p className="signals-muted">No alerts yet. Enter email and click "View my alerts".</p>
        ) : (
          <ul className="signals-list">
            {alerts.map((alert, index) => {
              const { bg, color, label } = getScoreMeta(alert.score);
              const time = formatTime(alert.triggeredAt ?? alert.createdAt);
              return (
                <li key={alert._id ?? index}>
                  <div className="signals-list-row">
                    <strong>{alert.symbol}</strong>
                    <span className="signals-score-badge" style={{ background: bg, color }}>
                      Score {alert.score} · {label}
                    </span>
                    {time ? <span className="signals-time">{time}</span> : null}
                  </div>
                  <div className="signals-reasons">
                    {(alert.reasons || []).slice(0, 3).join(" • ")}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SignalsForm;
