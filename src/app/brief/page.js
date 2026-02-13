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

  const summaryItems = useMemo(() => {
    if (Array.isArray(data?.summaryImportant) && data.summaryImportant.length) {
      return data.summaryImportant;
    }
    return data?.summary || [];
  }, [data]);
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
          <div className={styles.briefCard}>
            <div className={styles.stateCard}>Loading today’s summary…</div>
          </div>
        ) : error ? (
          <div className={styles.errorCard}>
            <div className="fw-semibold">Couldn’t load today’s brief.</div>
            <div className={`mt-1 ${styles.errorText}`}>{error}</div>
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
                <div className={styles.marketTitleWrap}>
                  <p className={styles.marketMeta}>Quick Pulse</p>
                  <h2 className={styles.marketTitle}>Market snapshot</h2>
                  <p className={styles.marketSub}>Real-time movement for major assets.</p>
                </div>
                <div className={styles.marketBadgeWrap}>
                  <span className={styles.marketBadgeLive}>Live</span>
                  <span className={styles.marketBadgeCount}>{market.length || 2} assets</span>
                </div>
              </div>
              {market.length ? (
                <div className={styles.marketGrid}>
                  {market.map((coin) => (
                    <div key={coin.id} className={styles.marketItem}>
                      <div className={styles.marketItemTop}>
                        <div>
                          <div className={styles.marketSymbol}>{coin.symbol?.toUpperCase()}</div>
                          <div className={styles.marketName}>{coin.name}</div>
                        </div>
                        <div
                          className={
                            coin.price_change_percentage_24h >= 0
                              ? styles.marketChangeUp
                              : styles.marketChangeDown
                          }
                        >
                          {fmtPct(coin.price_change_percentage_24h)}
                        </div>
                      </div>
                      <div className={styles.marketPriceRow}>
                        <div className={styles.marketPrice}>{fmtUsd(coin.current_price)}</div>
                        <div className={styles.marketLabel}>24h</div>
                      </div>
                      <div
                        className={
                          coin.price_change_percentage_24h >= 0
                            ? styles.marketChangeUp
                            : styles.marketChangeDown
                        }
                      >
                        {coin.price_change_percentage_24h >= 0 ? "Bullish momentum" : "Under pressure"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.stateCard}>Market data loading…</div>
              )}
            </div>

            <div className={styles.briefCard}>
              <div className={styles.topBar}>
                <div>
                  <p className={styles.eyebrow}>Daily Snapshot</p>
                  <h2 className={`h5 mb-2 ${styles.summaryHeading}`}>Today’s brief</h2>
                  <p className={styles.summarySubtitle}>A quick summary of today&apos;s important crypto news.</p>
                </div>
                <p className={styles.countPill}>{summaryItems.length} highlights</p>
              </div>
              {Array.isArray(summaryItems) && summaryItems.length ? (
                <>
                  <div className={styles.timeline}>
                    {visibleItems.map((p, idx) => (
                      <article key={idx} className={styles.timelineItem}>
                        <div className={styles.timelineDot} aria-hidden="true" />
                        <div className={styles.timelineContent}>
                          <p className={styles.itemText}>
                            <strong>{p.title}</strong> — {p.content}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
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
                  {data?.summaryImportantText && (
                    <div className={styles.summaryNarrative}>
                      <div className={styles.summaryNarrativeHead}>
                        <span className={styles.summaryNarrativeKicker}>Signal boost</span>
                        <h3 className={`h6 mb-0 ${styles.summaryNarrativeTitle}`}>Highlight recap</h3>
                      </div>
                      <p className={styles.summaryNarrativeText}>{data.summaryImportantText}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.stateCard}>No summary available.</div>
              )}
            </div>

            <div className={styles.newsletterCard}>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <div className={styles.newsletterTitle}>Want this in your inbox?</div>
                  <div className={styles.newsletterSub}>Free. No spam. Unsubscribe anytime.</div>
                </div>
                <Link href="/subscribe" className={`btn btn-glow ${styles.newsletterCta}`}>
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
