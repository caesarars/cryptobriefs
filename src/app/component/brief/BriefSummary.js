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
        const res = await fetch("https://crypto-blog-backend.vercel.app/api/briefs/getSummary");
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
      <section className="mt-4">
        <div className="container">
          <h2 className="space-title text-start mb-3 mt-5">Today’s brief</h2>
          <div className="p-4 rounded-4" style={{ background: "#f6f2fb" }}>
            <p className="mb-2" style={{ color: "#2b2b2b" }}>
              Loading today’s summary…
            </p>
            <p className="mb-0" style={{ color: "#4b4b4b" }}>
              If it takes a while, you can still browse the full brief.
            </p>
            <div className="mt-3 d-flex gap-2 flex-wrap">
              <Link href="/brief" className="btn btn-glow">
                Open brief
              </Link>
              <Link href="/subscribe" className="btn btn-outline-dark" style={{ borderRadius: 50 }}>
                Get it by email
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data || !Array.isArray(data.summary) || data.summary.length === 0) {
    return (
      <section className="mt-4">
        <div className="container">
          <h2 className="space-title text-start mb-3 mt-5">Today’s brief</h2>
          <div className="p-4 rounded-4" style={{ background: "#f6f2fb" }}>
            <p className="mb-0" style={{ color: "#2b2b2b" }}>
              No summary available yet.
            </p>
            <div className="mt-3">
              <Link href="/brief" className="btn btn-glow">
                Browse briefs
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-4">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h2 className="space-title text-start mb-3 mt-5">Today’s brief</h2>
          <Link href="/brief" className="btn btn-glow">
            Read full brief
          </Link>
        </div>
        <div className={styles.timeline}>
          {data.summary.map((point, i) => (
            <div className={styles.timelineItem} key={i}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <strong>{point.title}</strong> — {point.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
