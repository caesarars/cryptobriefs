"use client";

import { useEffect, useMemo, useState } from "react";
import { FaCoins } from "react-icons/fa";
import aptImg from "@/app/assets/image/aptos-apt-logo.png";
import avaxImg from "@/app/assets/image/avax.png";
import bchImg from "@/app/assets/image/bitcoin-cash-bch-logo.png";
import btcImg from "@/app/assets/image/bitcoin.png";
import bnbImg from "@/app/assets/image/bnb.png";
import adaImg from "@/app/assets/image/cardano-ada-logo.png";
import linkImg from "@/app/assets/image/chainlink.png";
import dogeImg from "@/app/assets/image/dogecoin.png";
import ethImg from "@/app/assets/image/ethereum.png";
import ltcImg from "@/app/assets/image/litecoin-ltc-logo.png";
import nearImg from "@/app/assets/image/near-protocol-near-logo.png";
import pepeImg from "@/app/assets/image/pepe-pepe-logo.png";
import dotImg from "@/app/assets/image/polkadot.png";
import shibImg from "@/app/assets/image/shiba.png";
import solImg from "@/app/assets/image/solana.png";
import xlmImg from "@/app/assets/image/stellar.png";
import suiImg from "@/app/assets/image/sui.png";
import trxImg from "@/app/assets/image/tron-trx-logo.png";
import uniImg from "@/app/assets/image/uniswap-uni-logo.png";
import xrpImg from "@/app/assets/image/xrp.png";
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

const COIN_OPTIONS = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "LINK", name: "Chainlink" },
  { symbol: "BNB", name: "BNB" },
  { symbol: "XRP", name: "XRP" },
  { symbol: "ADA", name: "Cardano" },
  { symbol: "DOGE", name: "Dogecoin" },
  { symbol: "AVAX", name: "Avalanche" },
  { symbol: "DOT", name: "Polkadot" },
  { symbol: "MATIC", name: "Polygon" },
  { symbol: "SUI", name: "Sui" },
  { symbol: "TON", name: "Toncoin" },
  { symbol: "TRX", name: "TRON" },
  { symbol: "LTC", name: "Litecoin" },
  { symbol: "BCH", name: "Bitcoin Cash" },
  { symbol: "XLM", name: "Stellar" },
  { symbol: "NEAR", name: "NEAR Protocol" },
  { symbol: "APT", name: "Aptos" },
  { symbol: "ATOM", name: "Cosmos" },
  { symbol: "ARB", name: "Arbitrum" },
  { symbol: "OP", name: "Optimism" },
  { symbol: "UNI", name: "Uniswap" },
  { symbol: "ETC", name: "Ethereum Classic" },
  { symbol: "FIL", name: "Filecoin" },
  { symbol: "HBAR", name: "Hedera" },
  { symbol: "ICP", name: "Internet Computer" },
  { symbol: "PEPE", name: "Pepe" },
  { symbol: "SHIB", name: "Shiba Inu" },
];

const COIN_ICON_BY_SYMBOL = {
  ADA: adaImg.src,
  APT: aptImg.src,
  AVAX: avaxImg.src,
  BCH: bchImg.src,
  BNB: bnbImg.src,
  BTC: btcImg.src,
  DOGE: dogeImg.src,
  DOT: dotImg.src,
  ETH: ethImg.src,
  LINK: linkImg.src,
  LTC: ltcImg.src,
  NEAR: nearImg.src,
  PEPE: pepeImg.src,
  SHIB: shibImg.src,
  SOL: solImg.src,
  SUI: suiImg.src,
  TRX: trxImg.src,
  UNI: uniImg.src,
  XLM: xlmImg.src,
  XRP: xrpImg.src,
};

function getCoinIcon(symbol) {
  return COIN_ICON_BY_SYMBOL[String(symbol || "").toUpperCase()] || null;
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

function getWeightVisual(weight) {
  const safe = clamp(Number(weight) || 0, 0, 100);
  const hue = Math.round(205 + safe * 1.35);
  const accentAlpha = 0.2 + safe / 400;
  const bgAlpha = 0.08 + safe / 600;

  return {
    percent: Math.round(safe),
    style: {
      "--weight-accent": `hsla(${hue}, 85%, 48%, ${accentAlpha.toFixed(2)})`,
      "--weight-bg": `hsla(${hue}, 90%, 55%, ${bgAlpha.toFixed(2)})`,
    },
  };
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
  const [openSymbolRow, setOpenSymbolRow] = useState(null);

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

  function getSymbolMatches(query) {
    const q = String(query || "").trim().toUpperCase();
    if (!q) return COIN_OPTIONS.slice(0, 12);
    return COIN_OPTIONS.filter((opt) => opt.symbol.includes(q) || opt.name.toUpperCase().includes(q)).slice(0, 12);
  }

  function coinMeta(symbol) {
    const clean = String(symbol || "").toUpperCase();
    return COIN_OPTIONS.find((opt) => opt.symbol === clean);
  }

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

        <section className="portfolio_card portfolio_tutorial">
          <h2 className="portfolio_card_title">What is this page?</h2>
          <p className="portfolio_tutorial_text">
            This page helps you measure daily sentiment for your crypto portfolio based on recent news. You enter coin symbols and weights,
            then the system computes a personal score from 0-100 and shows which headlines drive your portfolio up or down.
          </p>

          <h3 className="portfolio_tutorial_subtitle">How to use</h3>
          <ol className="portfolio_tutorial_steps">
            <li>Add your portfolio coins and estimated weights.</li>
            <li>Click "Create / Reset Portfolio" to save the portfolio.</li>
            <li>Click "Update today" to calculate the latest sentiment snapshot.</li>
            <li>Read score, delta, and top positive/negative drivers to understand market narrative impact.</li>
          </ol>
        </section>

        <section className="portfolio_card">
          <h2 className="portfolio_card_title">Portfolio Setup</h2>

          <div className="portfolio_rows_header">
            <div className="portfolio_header_cell">
              Symbol
              <span className="portfolio_help" tabIndex={0}>
                ?
                <span className="portfolio_help_tip">Ticker coin, contoh: BTC, ETH, SOL.</span>
              </span>
            </div>
            <div className="portfolio_header_cell">
              Weight (%)
              <span className="portfolio_help" tabIndex={0}>
                ?
                <span className="portfolio_help_tip">Porsi coin di portofolio Anda. Tidak harus pas 100, sistem akan normalisasi.</span>
              </span>
            </div>
            <div />
          </div>

          <div className="portfolio_rows_body">
            {rows.map((r, idx) => {
              const weightVisual = getWeightVisual(r.weight);
              const selectedCoinIcon = getCoinIcon(r.symbol);
              return (
                <div key={idx} className="portfolio_row">
                <div>
                  <label className="portfolio_mobile_label portfolio_mobile_label_with_help">
                    Symbol
                    <span className="portfolio_help" tabIndex={0}>
                      ?
                      <span className="portfolio_help_tip">Ticker coin, contoh: BTC, ETH, SOL.</span>
                    </span>
                  </label>
                  <div className="portfolio_symbol_combo">
                    <div className="portfolio_symbol_icon" aria-hidden="true">
                      {selectedCoinIcon ? (
                        <img src={selectedCoinIcon} alt={`${r.symbol} logo`} className="portfolio_symbol_coin_img" />
                      ) : (
                        coinMeta(r.symbol)?.symbol?.slice(0, 2) || <FaCoins size={11} />
                      )}
                    </div>
                    <input
                      value={r.symbol}
                      onFocus={() => setOpenSymbolRow(idx)}
                      onBlur={() => {
                        setTimeout(() => setOpenSymbolRow((current) => (current === idx ? null : current)), 120);
                      }}
                      onChange={(e) => {
                        const next = [...rows];
                        next[idx] = { ...next[idx], symbol: e.target.value.toUpperCase() };
                        setRows(next);
                        setOpenSymbolRow(idx);
                      }}
                      placeholder="Search coin (BTC, ETH, SOL)"
                      className="portfolio_input portfolio_symbol_input"
                    />

                    {openSymbolRow === idx ? (
                      <div className="portfolio_symbol_menu">
                        {getSymbolMatches(r.symbol).map((opt) => (
                          <button
                            key={opt.symbol}
                            type="button"
                            className="portfolio_symbol_option"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              const next = [...rows];
                              next[idx] = { ...next[idx], symbol: opt.symbol };
                              setRows(next);
                              setOpenSymbolRow(null);
                            }}
                          >
                            <span className="portfolio_symbol_option_icon">
                              {getCoinIcon(opt.symbol) ? (
                                <img src={getCoinIcon(opt.symbol)} alt={`${opt.symbol} logo`} className="portfolio_symbol_coin_img" />
                              ) : (
                                opt.symbol.slice(0, 2)
                              )}
                            </span>
                            <span className="portfolio_symbol_option_text">
                              {opt.name} ({opt.symbol})
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="portfolio_mobile_label portfolio_mobile_label_with_help">
                    Weight (%)
                    <span className="portfolio_help" tabIndex={0}>
                      ?
                      <span className="portfolio_help_tip">Porsi coin di portofolio Anda. Tidak harus pas 100, sistem akan normalisasi.</span>
                    </span>
                  </label>
                  <div className="portfolio_weight_wrap" style={weightVisual.style}>
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
                      className="portfolio_input portfolio_weight_input"
                    />
                    <span className="portfolio_weight_badge">{weightVisual.percent}%</span>
                  </div>
                </div>

                <div className="portfolio_remove_wrap">
                  <button onClick={() => setRows(rows.filter((_, i) => i !== idx))} className="portfolio_btn portfolio_btn_ghost" type="button">
                    Remove
                  </button>
                </div>
                </div>
              );
            })}
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
