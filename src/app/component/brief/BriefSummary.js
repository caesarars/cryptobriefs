// components/BriefSummary.js

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./BriefSummary.module.css";

export default function BriefSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("https://ces.dbrata.my.id/api/briefs/getSummary");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // Landing page UX: avoid big skeleton blocks.
  if (loading) {
    return (
      <section className={styles.sectionWrap}>
        <div className="container">
          <div className={styles.briefCard}>
            <div className={styles.topBar}>
              <div>
                <p className={styles.eyebrow}>Daily Snapshot</p>
                <h2 className={`space-title text-start mb-2 ${styles.title}`}>Today’s brief</h2>
                <p className={styles.subtitle}>
                  Quick highlights from today&apos;s crypto landscape.
                </p>
              </div>
            </div>

            <div className={styles.stateCard}>
              <p className={styles.stateTitle}>Loading today’s summary…</p>
              <p className={styles.stateText}>
                If it takes a while, you can still browse the full brief.
              </p>
              <div className="mt-3 d-flex gap-2 flex-wrap">
                <Link href="/brief" className={`btn btn-glow ${styles.actionButton}`}>
                  Open brief
                </Link>
                <Link href="/subscribe" className={`btn btn-outline-dark ${styles.ghostButton}`}>
                  Get it by email
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const isSameDay = (value) => {
    if (!value) return false;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  const isTodayBrief = isSameDay(data?.date);

  if (!data || !Array.isArray(data.summary) || data.summary.length === 0 || !isTodayBrief) {
    return (
      <section className={styles.sectionWrap}>
        <div className="container">
          <div className={styles.briefCard}>
            <div className={styles.topBar}>
              <div>
                <p className={styles.eyebrow}>Daily Snapshot</p>
                <h2 className={`space-title text-start mb-2 ${styles.title}`}>Today’s brief</h2>
                <p className={styles.subtitle}>New summary is still being prepared.</p>
              </div>
            </div>

            <div className={styles.stateCard}>
              <p className={styles.stateTitle}>No summary available yet.</p>
              <div className="mt-3">
                <Link href="/brief" className={`btn btn-glow ${styles.actionButton}`}>
                  Open brief
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.sectionWrap}>
      <div className="container">
        <div className={styles.briefCard}>
          <div className={styles.topBar}>
            <div>
              <p className={styles.eyebrow}>Daily Snapshot</p>
              <h2 className={`space-title text-start mb-2 ${styles.title}`}>Today’s brief</h2>
              <p className={styles.subtitle}>
                A quick summary of today's important crypto news.
              </p>
            </div>
            <div className={styles.topBarRight}>
              <p className={styles.countPill}>{data.summary.length} highlights</p>
              <Link href="/brief" className={`btn btn-glow ${styles.actionButton}`}>
                Read full brief
              </Link>
            </div>
          </div>

          <div className={styles.timeline}>
            {data.summary.map((point, i) => (
              <article className={styles.timelineItem} key={i}>
                <div className={styles.timelineDot} aria-hidden="true" />
                <div className={styles.timelineContent}>
                  <p className={styles.itemText}>
                    <strong>{point.title}</strong> — {point.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
