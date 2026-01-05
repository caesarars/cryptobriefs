// components/BriefSummary.js

"use client";

import { useEffect, useState } from "react";
import styles from "./BriefSummary.module.css";


export default function BriefSummary() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const LoadingBriefComponent = () => {
      return (
        <section className="mt-4">
          <div className="container">
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonTimeline}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div className={styles.skeletonItem} key={i}>
                  <div className={styles.skeletonDot} />
                  <div className={styles.skeletonLines}>
                    <div className={styles.skeletonLineWide} />
                    <div className={styles.skeletonLine} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }
  
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
  
    if (loading) return LoadingBriefComponent()
    if (!data) return <p>No summary available.</p>;
  const formattedDate = new Date(data.date).toLocaleDateString();

  return (
    <section className="mt-4">
        <div className="container">
        <h1 className="space-title text-start mb-4 mt-5">Brief News</h1>
            { loading ? <p>Loading brief...</p> :
            <div className={styles.timeline}>
            {data.summary.map((point, i) => (
                <div className={styles.timelineItem} key={i}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}><strong>{point.title}</strong> - {point.content}</div>
                </div>
            ))}
            </div>  }
        </div>
    </section>
  );
}
