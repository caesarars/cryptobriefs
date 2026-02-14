// src/app/news/page.jsx
"use client";

import { useEffect, useState } from "react";
import "./News.css";
import { useRouter } from "next/navigation";

const formatDate = (dateValue) => {
  if (!dateValue) return "Unknown date";
  return new Date(dateValue).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const News = () => {

    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleNews, setVisibleNews] = useState(6);
    const [searchTerm, setSearchTerm] = useState(""); // 🔍 State untuk pencarian
    const [sortOrder, setSortOrder] = useState("newest"); // 📌 Sorting state (default: terbaru)
    const [selectedSource, setSelectedSource] = useState("All"); // Default: Semua berita

    const router = useRouter();


  useEffect(() => {
  const fetchNews = async () => {
      try {
        const response = await fetch("https://ces.dbrata.my.id/api/news/getNews");
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
          <div className="news-grid">
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

    if (isLoading) {
      return (
        <section className="news_section_wrap">
          <div className="container">
            <div className="news_widget_card">
              <div className="news_top_bar">
                <div>
                  <p className="news_eyebrow">Market Wire</p>
                  <h2 className="space-title text-start mb-2 news_title">Newsletter</h2>
                  <p className="news_subtitle">Headlines that matter across crypto markets.</p>
                </div>
              </div>
              <LoadingSkeleton />
            </div>
          </div>
        </section>
      );
    }

    if (!sortedNews || sortedNews.length === 0) {
      return (
        <section className="news_section_wrap">
          <div className="container">
            <div className="news_widget_card">
              <div className="news_top_bar">
                <div>
                  <p className="news_eyebrow">Market Wire</p>
                  <h2 className="space-title text-start mb-2 news_title">Newsletter</h2>
                  <p className="news_subtitle">Headlines that matter across crypto markets.</p>
                </div>
              </div>
              <div className="p-4 rounded-4 news_empty_state">
                <p className="mb-0 news_empty_text">
                  No headlines available right now.
                </p>
                <div className="mt-3">
                  <button onClick={() => router.push("/news")} className="btn btn-glow news_cta">
                    Browse news
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="news_section_wrap">
        <div className="container">
          <div className="news_widget_card">
            <div className="news_top_bar">
              <div>
                <p className="news_eyebrow">Market Wire</p>
                <h2 className="space-title text-start mb-2 news_title">Newsletter</h2>
                <p className="news_subtitle">Headlines that matter across crypto markets.</p>
              </div>
              <div className="news_top_bar_right">
                <p className="news_count_pill">{Math.min(visibleNews, sortedNews.length)} headlines</p>
                <button onClick={() => router.push("/news")} className="btn btn-glow news_cta">
                  Browse news
                </button>
              </div>
            </div>

            <div className="news-grid">
              {sortedNews.slice(0, visibleNews).map((item, index) => (
                <div key={index} className="news-card-item">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <img
                      loading="lazy"
                      src={item.image || imageDefault}
                      alt={item.title}
                      className="news-card-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = imageDefault;
                      }}
                    />
                  </a>
                  <div className="news-card-content">
                    <h3 className="news-card-title">{item.title}</h3>
                    <p className="news-card-date">{formatDate(item.published)}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => router.push("/news")} className="btn btn-glow news_see_more">
              See More
            </button>
          </div>
        </div>
      </section>
    );
}

export default News;
