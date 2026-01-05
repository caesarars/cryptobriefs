// src/app/news/page.jsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./News.css";
import { useRouter } from "next/navigation";
import styles from "./NewsStyles";


const News = () => {

    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleNews, setVisibleNews] = useState(6);
    const [searchTerm, setSearchTerm] = useState(""); // 🔍 State untuk pencarian
    const [sortOrder, setSortOrder] = useState("newest"); // 📌 Sorting state (default: terbaru)
    const [selectedSource, setSelectedSource] = useState("All"); // Default: Semua berita

    const navigate = useRouter()


  useEffect(() => {
  const fetchNews = async () => {
      try {
        const response = await fetch("https://crypto-blog-backend.vercel.app/api/news/getNews");
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

    const imageDefault = "https://firebasestorage.googleapis.com/v0/b/image-storing-project.appspot.com/o/cryptocurrency.jpg?alt=media&token=2ba8d0f2-434e-4b27-a702-44e7086e481a"

    // 🔍 Filter berita berdasarkan searchTerm
    const filteredNews = news.filter((item) =>
      (selectedSource === "All" || item.link.includes(selectedSource)) &&
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 🔥 Sortir berita berdasarkan tanggal (setelah difilter)
    const sortedNews = [...filteredNews].sort((a, b) => {
      return sortOrder === "newest"
        ? new Date(b.published) - new Date(a.published) // Terbaru duluan
        : new Date(a.published) - new Date(b.published); // Terlama duluan
    });

    const LoadingSkeleton = () => {
      return (
        <>
          <div className="news-skeleton-title"></div>
          <div style={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="news-skeleton-card">
                <div className="news-skeleton-image"></div>
                <div className="news-skeleton-content">
                  <div className="news-skeleton-line-wide"></div>
                  <div className="news-skeleton-line"></div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    };

    return (
        <div className="container pt-5 pb-3">
            <h1 className="pt-4 pb-3 space-title">Newsletter</h1>
            {isLoading ? (
                <LoadingSkeleton />
            ) : (
                <div style={styles.grid}>
                {sortedNews.slice(0, visibleNews).map((item, index) => (
                    <div key={index} style={styles.card}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <img
                      loading="lazy"
                        src={item.image || imageDefault}
                        alt={item.title}
                        style={styles.image}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = imageDefault;
                        }}
                      />
                    </a>
                    <div style={styles.content}>
                        <h2 style={styles.newsTitle}>{item.title}</h2>
                        <p style={styles.date}>{new Date(item.published).toLocaleString()}</p>
                    </div>
                    </div>
                ))}
                </div>
            )}

                <button onClick={() => navigate("/news")} className="btn-glow" style={styles.loadMore}>
                  See More
                </button>
               
        </div>
    )
}

export default News;
