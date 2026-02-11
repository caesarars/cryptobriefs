"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./BriefIndex.module.css";

export default function BriefIndexPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

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

  const summaryItems = useMemo(() => data?.summary || [], [data]);
  const visibleItems = showAll ? summaryItems : summaryItems.slice(0, 10);

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
