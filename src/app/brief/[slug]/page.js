"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./briefs.css"; // Buat file ini untuk styling

export default function BriefsPage() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch("http://localhost:5005/api/briefs/getSummary");
        const data = await res.json();

        if (res.ok) {
          setSummary(data.summary || "");
          setTitles(data.titles || []);
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
  }, []);

  return (
    <div className="briefs-container">
      <h1 className="briefs-title"></h1>

      {loading ? (
        <p>Loading summary...</p>
      ) : (
        <>
          <div className="briefs-summary">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
            <p dangerouslySetInnerHTML={{ __html: summary }}/>
          {titles.length > 0 && (
            <div className="briefs-titles">
              <h2>🧠 Article Titles</h2>
              <ul>
                {titles.map((title, index) => (
                  <li key={index}>{title}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
