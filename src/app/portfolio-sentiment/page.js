"use client";

import { useEffect, useMemo, useState } from "react";
import "./page.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

function apiUrl(path) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function getScoreTone(score) {
  if (score >= 67) return "positive";
  if (score <= 39) return "negative";
  return "neutral";
}

function normalizeHoldings(rows) {
  const cleaned = rows
    .map((r) => ({
      symbol: String(r.symbol || "")
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, ""),
      weight: Number(r.weight),
    }))
    .filter((r) => r.symbol && Number.isFinite(r.weight) && r.weight > 0);

  const total = cleaned.reduce((acc, r) => acc + r.weight, 0);
  if (total <= 0) return [];

  return cleaned.map((r) => ({ ...r, weight: r.weight / total }));
}

export default function PortfolioSentimentPage() {
  const [rows, setRows] = useState([
    { symbol: "BTC", weight: 40 },
    { symbol: "ETH", weight: 30 },
    { symbol: "SOL", weight: 20 },
    { symbol: "LINK", weight: 10 },
  ]);

  const [portfolioId, setPortfolioId] = useState(null);
  const [editToken, setEditToken] = useState(null);
  const [status, setStatus] = useState("");
  const [today, setToday] = useState(null);
  const [error, setError] = useState(null);

  const holdings = useMemo(() => normalizeHoldings(rows), [rows]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cb_portfolio") || "null");
      if (saved?.portfolioId && saved?.editToken) {
        setPortfolioId(saved.portfolioId);
        setEditToken(saved.editToken);
      }
    } catch {}
  }, []);

  async function createPortfolio() {
    setError(null);
    setStatus("Creating portfolio...");

    if (!holdings.length) {
      setStatus("");
      setError("Holdings invalid. Fill symbol + weight.");
      return;
    }

    const res = await fetch(apiUrl("/api/portfolios"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "My Portfolio", holdings }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      setStatus("");
      setError(`Create failed: ${res.status} ${t.slice(0, 200)}`);
      return;
    }

    const data = await res.json();
    localStorage.setItem("cb_portfolio", JSON.stringify({ portfolioId: data.portfolioId, editToken: data.editToken }));
    setPortfolioId(data.portfolioId);
    setEditToken(data.editToken);
    setStatus("Portfolio created.");
  }

  async function recomputeToday() {
    if (!portfolioId) {
      setError("Create portfolio first.");
      return;
    }

    setError(null);
    setStatus("Computing sentiment...");

    const res = await fetch(apiUrl(`/api/portfolios/${portfolioId}/sentiment/compute`), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(editToken ? { "x-edit-token": editToken } : {}),
      },
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      setStatus("");
      setError(`Compute failed: ${res.status} ${t.slice(0, 200)}`);
      return;
    }

    const data = await res.json();
    setToday(data);
    setStatus("Updated.");
  }

  async function loadToday() {
    if (!portfolioId) return;

    setError(null);
    const res = await fetch(apiUrl(`/api/portfolios/${portfolioId}/sentiment/today`), { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setToday(data);
    }
  }

  useEffect(() => {
    loadToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioId]);

  const safeScore = clamp(Number(today?.personalScore || 0), 0, 100);
  const scoreTone = getScoreTone(safeScore);

  return (
    <section className="portfolio_page_wrap">
      <div className="portfolio_glow portfolio_glow_a" aria-hidden="true" />
      <div className="portfolio_glow portfolio_glow_b" aria-hidden="true" />

      <div className="container portfolio_page_container">
        <header className="portfolio_hero">
          <p className="portfolio_eyebrow">Personal Signal Engine</p>
          <h1 className="portfolio_title">Portfolio Sentiment</h1>
          <p className="portfolio_subtitle">
            Enter your portfolio weights and get a daily sentiment score from the latest crypto headlines.
          </p>
        </header>

        <section className="portfolio_card">
          <h2 className="portfolio_card_title">Portfolio Setup</h2>

          <div className="portfolio_rows_header" aria-hidden="true">
            <div>Symbol</div>
            <div>Weight (%)</div>
            <div />
          </div>

          <div className="portfolio_rows_body">
            {rows.map((r, idx) => (
              <div key={idx} className="portfolio_row">
                <div>
                  <label className="portfolio_mobile_label">Symbol</label>
                  <input
                    value={r.symbol}
                    onChange={(e) => {
                      const next = [...rows];
                      next[idx] = { ...next[idx], symbol: e.target.value };
                      setRows(next);
                    }}
                    placeholder="BTC"
                    className="portfolio_input"
                  />
                </div>

                <div>
                  <label className="portfolio_mobile_label">Weight (%)</label>
                  <input
                    type="number"
                    value={r.weight}
                    onChange={(e) => {
                      const next = [...rows];
                      next[idx] = { ...next[idx], weight: e.target.value === "" ? "" : Number(e.target.value) };
                      setRows(next);
                    }}
                    placeholder="40"
                    min={0}
                    step={1}
                    className="portfolio_input"
                  />
                </div>

                <div className="portfolio_remove_wrap">
                  <button onClick={() => setRows(rows.filter((_, i) => i !== idx))} className="portfolio_btn portfolio_btn_ghost" type="button">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="portfolio_actions">
            <button onClick={() => setRows([...rows, { symbol: "", weight: 0 }])} className="portfolio_btn portfolio_btn_ghost" type="button">
              Add coin
            </button>

            <button onClick={createPortfolio} className="portfolio_btn portfolio_btn_primary" type="button">
              Create / Reset Portfolio
            </button>

            <button onClick={recomputeToday} className="portfolio_btn portfolio_btn_primary" type="button">
              Update today
            </button>
          </div>

          <div className="portfolio_status_wrap">
            {portfolioId ? (
              <p>
                Portfolio ID: <code>{portfolioId}</code>
              </p>
            ) : (
              <p>No portfolio yet.</p>
            )}
            {status ? <p className="portfolio_status">{status}</p> : null}
            {error ? <p className="portfolio_error">{error}</p> : null}
          </div>
        </section>

        <section className="portfolio_card">
          <h2 className="portfolio_card_title">Today</h2>

          {!today ? (
            <div className="portfolio_empty">No data yet. Click "Update today".</div>
          ) : (
            <>
              <div className="portfolio_score_row">
                <div className={`portfolio_score_chip portfolio_score_${scoreTone}`}>{safeScore}/100</div>
                <div className="portfolio_delta">
                  Delta {today.deltaPersonal >= 0 ? "+" : ""}
                  {today.deltaPersonal}
                </div>
                {today.alert?.personalShift ? <div className="portfolio_shift_badge">Significant shift</div> : null}
              </div>

              <div className="portfolio_meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeScore}>
                <div className="portfolio_meter_fill" style={{ width: `${safeScore}%` }} />
              </div>

              <div className="portfolio_breakdown">
                <div className="portfolio_breakdown_head">Coin</div>
                <div className="portfolio_breakdown_head">Score</div>
                <div className="portfolio_breakdown_head">Delta</div>
                <div className="portfolio_breakdown_head">News</div>

                {(today.perCoin || []).map((c) => (
                  <div key={c.symbol} className="portfolio_breakdown_row">
                    <div>
                      {c.symbol} ({Math.round(c.weight * 100)}%)
                    </div>
                    <div>{c.coinScore}/100</div>
                    <div>
                      {c.delta >= 0 ? "+" : ""}
                      {c.delta}
                    </div>
                    <div>{c.newsCount}</div>
                  </div>
                ))}
              </div>

              <div className="portfolio_drivers_grid">
                <div className="portfolio_driver_card">
                  <h3>Top negative drivers</h3>
                  {flattenTop(today.perCoin, "topNeg").slice(0, 5).map((a) => (
                    <div key={a.link} className="portfolio_driver_item">
                      <a href={a.link} target="_blank" rel="noreferrer">
                        {a.title}
                      </a>
                      <p>impact: {a.impact.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="portfolio_driver_card">
                  <h3>Top positive drivers</h3>
                  {flattenTop(today.perCoin, "topPos").slice(0, 5).map((a) => (
                    <div key={a.link} className="portfolio_driver_item">
                      <a href={a.link} target="_blank" rel="noreferrer">
                        {a.title}
                      </a>
                      <p>impact: {a.impact.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        <p className="portfolio_notes">
          Notes: Score uses the last 24h of backend news (<code>news</code>). If coverage is low, scores shrink toward 50.
        </p>
      </div>
    </section>
  );
}

function flattenTop(perCoin, key) {
  const arr = [];
  for (const c of perCoin || []) {
    for (const a of c?.[key] || []) {
      arr.push(a);
    }
  }
  return arr.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
}
