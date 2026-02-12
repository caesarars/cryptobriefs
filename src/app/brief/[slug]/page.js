"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./briefs.css";

export default function BriefsPage() {
  const { slug } = useParams();
  const [summaryItems, setSummaryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!slug) return;

    async function fetchSummary() {
      try {
        const res = await fetch(`https://ces.dbrata.my.id/api/briefs/summary/${slug}`);
        const data = await res.json();

        if (res.ok) {
          setSummaryItems(Array.isArray(data.summary) ? data.summary : []);
          setArticles(Array.isArray(data.articles) ? data.articles : []);
          setDate(data.date || "");
        } else {
          console.error("Error fetching summary:", data.error);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [slug]);

  const formattedDate = date
    ? new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : slug;

  return (
    <div className="briefs-container">
      <h1 className="briefs-title">Crypto Brief — {formattedDate}</h1>

      {loading ? (
        <p>Loading summary...</p>
      ) : summaryItems.length ? (
        <>
          <div className="briefs-summary">
            <ul>
              {summaryItems.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.title}</strong> — {item.content}
                </li>
              ))}
            </ul>
          </div>

          {articles.length > 0 && (
            <div className="briefs-titles">
              <h2>🧠 Article Titles</h2>
              <ul>
                {articles.map((article, index) => (
                  <li key={index}>{article.title}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>No summary available.</p>
      )}
    </div>
  );
}
