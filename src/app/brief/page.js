"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./BriefIndex.module.css";

export default function BriefIndexPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [market, setMarket] = useState([]);
  const [archiveGroups, setArchiveGroups] = useState([]);
  const [archiveError, setArchiveError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("https://ces.dbrata.my.id/api/briefs/getSummary");
        if (!res.ok) throw new Error("Failed to load brief");
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e?.message || "Failed to load brief");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    const runMarket = async () => {
      try {
        const ids = "bitcoin,ethereum";
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=2&page=1&sparkline=false&price_change_percentage=24h`
        );
        if (!res.ok) return;
        const json = await res.json();
        setMarket(Array.isArray(json) ? json : []);
      } catch {
        // ignore
      }
    };
    runMarket();
  }, []);

  useEffect(() => {
    const runArchive = async () => {
      try {
        const res = await fetch("https://ces.dbrata.my.id/api/briefs/summaries?limit=60");
        if (!res.ok) throw new Error("Failed to load archive");
        const json = await res.json();
        const grouped = Array.isArray(json.grouped) ? json.grouped : [];
        setArchiveGroups(grouped);
      } catch (e) {
        setArchiveError(e?.message || "Failed to load archive");
      }
    };
    runArchive();
  }, []);

  const summaryItems = useMemo(() => data?.summary || [], [data]);
  const visibleItems = showAll ? summaryItems : summaryItems.slice(0, 10);

  const fmtUsd = (n) => {
    if (n === null || n === undefined) return "–";
    const num = Number(n);
    if (!Number.isFinite(num)) return "–";
    return num.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: num < 1 ? 6 : 2,
    });
  };

  const fmtPct = (n) => {
    if (n === null || n === undefined) return "–";
    const num = Number(n);
    if (!Number.isFinite(num)) return "–";
    const sign = num > 0 ? "+" : "";
    return `${sign}${num.toFixed(2)}%`;
  };

  const fmtDate = (value) => {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fmtTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container py-5">
      <div className={styles.briefWrapper}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h1 className="space-title mb-0">Today’s Crypto Brief</h1>
          <Link href="/subscribe" className="btn btn-glow">
            Get this daily by email
          </Link>
        </div>

        <p className={`mt-3 ${styles.briefIntro}`}>
          A fast scan of sentiment, movers, and what matters today.
        </p>

        {loading ? (
          <div className={styles.summaryCard}>
            Loading…
          </div>
        ) : error ? (
          <div className="p-4 rounded-4" style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}>
            <div className="fw-semibold">Couldn’t load today’s brief.</div>
            <div className="mt-1" style={{ color: "#6b7280" }}>{error}</div>
            <div className="mt-3 d-flex gap-2 flex-wrap">
              <a className="btn btn-dark" href="/">
                Back home
              </a>
              <Link className="btn btn-outline-dark" href="/subscribe" style={{ borderRadius: 50 }}>
                Subscribe
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className={styles.marketCard}>
              <div className={styles.marketHeader}>
                <h2 className="h6 mb-0">Market snapshot</h2>
                <span className={styles.marketBadge}>Live</span>
              </div>
              {market.length ? (
                <div className={styles.marketGrid}>
                  {market.map((coin) => (
                    <div key={coin.id} className={styles.marketItem}>
                      <div className={styles.marketSymbol}>{coin.symbol?.toUpperCase()}</div>
                      <div className={styles.marketPrice}>{fmtUsd(coin.current_price)}</div>
                      <div
                        className={
                          coin.price_change_percentage_24h >= 0
                            ? styles.marketChangeUp
                            : styles.marketChangeDown
                        }
                      >
                        {fmtPct(coin.price_change_percentage_24h)} (24h)
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-0" style={{ color: "#6b7280" }}>
                  Market data loading…
                </p>
              )}
            </div>

            <div className={styles.summaryCard}>
              <h2 className="h5 mb-3">Summary</h2>
              {Array.isArray(summaryItems) && summaryItems.length ? (
                <>
                  <ul className={styles.summaryList}>
                    {visibleItems.map((p, idx) => (
                      <li key={idx} className={styles.summaryItem}>
                        <div className={styles.summaryTitle}>{p.title}</div>
                        <div className={styles.summaryContent}>{p.content}</div>
                      </li>
                    ))}
                  </ul>
                  {summaryItems.length > 10 && (
                    <div className="mt-3">
                      <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={() => setShowAll((prev) => !prev)}
                      >
                        {showAll ? "Show less" : `Show all ${summaryItems.length} items`}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="mb-0">No summary available.</p>
              )}
            </div>

            <div className={styles.archiveCard}>
              <h2 className="h5 mb-3">Brief archive</h2>
              {archiveError ? (
                <p className="mb-0" style={{ color: "#6b7280" }}>{archiveError}</p>
              ) : archiveGroups.length ? (
                <div className={styles.archiveGroups}>
                  {archiveGroups.map((group) => (
                    <div key={group.date} className={styles.archiveGroup}>
                      <div className={styles.archiveDate}>{fmtDate(group.date)}</div>
                      <div className={styles.archiveList}>
                        {group.items.map((item) => {
                          const label = fmtTime(item.createdAt || item.date) || item.slug;
                          return (
                            <Link
                              key={item.slug}
                              href={`/brief/${item.slug}`}
                              className={styles.archiveLink}
                            >
                              {label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-0" style={{ color: "#6b7280" }}>Archive loading…</p>
              )}
            </div>

            <div className={styles.newsletterCard}>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <div className="fw-bold" style={{ fontSize: "1.1rem" }}>Want this in your inbox?</div>
                  <div style={{ opacity: 0.9 }}>Free. No spam. Unsubscribe anytime.</div>
                </div>
                <Link href="/subscribe" className="btn btn-glow">
                  Join newsletter
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
