'use client';

import { useEffect, useState } from 'react';
import './CoinNewsFeed.css';

export default function CoinNewsFeed({ coinSymbol, coinName }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://crypto-blog-backend.vercel.app/api/news/newsWithSentiment?coin=${coinSymbol}&period=week`
        );
        const data = await response.json();
        setNews(data.news?.slice(0, 5) || []); // Get latest 5 articles
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    if (coinSymbol) {
      fetchNews();
    }
  }, [coinSymbol]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getSentimentColor = (sentiment) => {
    const s = sentiment?.toLowerCase();
    if (s === 'bullish') return '#22c55e';
    if (s === 'bearish') return '#ef4444';
    return '#f59e0b';
  };

  const getSentimentIcon = (sentiment) => {
    const s = sentiment?.toLowerCase();
    if (s === 'bullish') return '📈';
    if (s === 'bearish') return '📉';
    return '➖';
  };

  if (loading) {
    return (
      <div className="coin-news-feed">
        <h2 className="coin-news-title">Latest {coinName} News</h2>
        <div className="coin-news-loading">
          <div className="coin-news-skeleton"></div>
          <div className="coin-news-skeleton"></div>
          <div className="coin-news-skeleton"></div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="coin-news-feed">
        <h2 className="coin-news-title">Latest {coinName} News</h2>
        <p className="coin-news-empty">No recent news available for {coinName}</p>
      </div>
    );
  }

  return (
    <div className="coin-news-feed">
      <div className="coin-news-header">
        <h2 className="coin-news-title">Latest {coinName} News</h2>
        <a href={`/news?coin=${coinSymbol}`} className="coin-news-view-all">
          View all →
        </a>
      </div>

      <div className="coin-news-list">
        {news.map((article, index) => (
          <a
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="coin-news-item"
          >
            <div className="coin-news-content">
              <h3 className="coin-news-item-title">{article.title}</h3>
              <div className="coin-news-meta">
                <span className="coin-news-date">{formatDate(article.published)}</span>
                {article.sentiment && (
                  <span
                    className="coin-news-sentiment"
                    style={{ color: getSentimentColor(article.sentiment) }}
                  >
                    {getSentimentIcon(article.sentiment)} {article.sentiment}
                  </span>
                )}
              </div>
            </div>
            <div className="coin-news-arrow">→</div>
          </a>
        ))}
      </div>
    </div>
  );
}
