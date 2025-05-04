// components/BriefSummary.js

"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./BriefSummary.module.css";


export default function BriefSummary() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    function splitSummary(summaryText) {
      return summaryText.split(/(?=\d+\.\s)/g).map(p => p.trim()).filter(Boolean);
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
  
    if (loading) return <p>Loading brief...</p>;
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
        

        {/*<div className={styles.timeline}>
        {data.articles.map((article, i) => (
            <div className={styles.timelineItem} key={i}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                {article.title}
                </a>
            </div>
            </div>
        ))} 
        </div>*/}
        </div>
    </section>
  );
}
