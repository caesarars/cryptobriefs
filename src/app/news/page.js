'use client';

import { useState, useEffect, useCallback } from "react";
import styles from "./NewsPage.module.css";
import "./NewsPage.css";

import ListNews from "./ListNews";
import FilterNews from "./FilterNews";
import TrendingTopics from "../component/TrendingTopics";
import Loading from "../component/loading/Loading";
import Pagination from "../blogs/Pagination";
import { api } from "../lib/backend";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const NEWS_PER_PAGE = 9; 

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 0 });
  
  const [filters, setFilters] = useState({
    coin: "",
    sentiment: "",
    search: "",
    sort: "latest", 
  });
  
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = {
        page,
        limit: NEWS_PER_PAGE,
        coins: filters.coin || "",
        sentiment: filters.sentiment || "",
        search: debouncedSearch || "",
        sort: filters.sort || "latest",
      };
      
      const queryParams = new URLSearchParams(query).toString();
      const response = await fetch(api(`/api/news/news?${queryParams}`));

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch news");
      }

      const result = await response.json();
      setNews(Array.isArray(result.data) ? result.data : []);
      setPagination(result.pagination || { total: 0, page: 1, totalPages: 0 });
    } catch (err) {
      setError(err.message);
      setNews([]);
    }
    setLoading(false);
  }, [page, filters.coin, filters.sentiment, filters.sort, debouncedSearch]);


  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); 
  };

  const handleTopicSelect = (topic) => {
    setFilters({
        search: topic, 
        coin: '', 
        sentiment: '',
        sort: 'latest'
    });
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const hasActiveFilter = Boolean(filters.search || filters.coin || filters.sentiment || filters.sort !== "latest");
  const activeFilters = [
    filters.search ? `Search: ${filters.search}` : null,
    filters.coin ? `Coin: ${filters.coin}` : null,
    filters.sentiment ? `Sentiment: ${filters.sentiment}` : null,
  ].filter(Boolean);

return (
  <div className={styles.page}>
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroCard}>
          <p className={styles.eyebrow}>Newsroom</p>
          <h1 className={styles.title}>Crypto news with signal, not noise.</h1>
          <p className={styles.subtitle}>
            Scan headlines, filter by coin and sentiment, and keep tabs on what matters
            most in the market today.
          </p>
        </div>
      </div>
    </section>

    <section className={styles.contentSection}>
      <div className="container mb-5">
        <div className={styles.controlsCard}>
          <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center gap-3">
            <div className="flex-grow-1">
              <FilterNews onHandleFilter={handleFilterChange} initialValues={filters} />
            </div>
          </div>
          {hasActiveFilter ? (
            <div className="news-filter-hint">
              {activeFilters.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.trendingWrap}>
          <TrendingTopics onTopicSelect={handleTopicSelect} />
        </div>

        {loading && (
          <div className="news-loading-wrap">
            <Loading />
          </div>
        )} 
        {error && <div className="alert alert-danger text-center mt-4 news-state">{error}</div>}
        {!loading && !error && (news.length > 0 ? <ListNews data={news} /> : (
          <div className="news-empty">
            <h3>No news found</h3>
            <p>Try changing filters or search terms to see more results.</p>
          </div>
        )) }
      </div>

      {!loading && !error && pagination.totalPages > 1 && (
        <div className={`${styles.paginationWrap} container`}>
          <Pagination 
            currentPage={pagination.page || page} 
            totalPages={pagination.totalPages} 
            handlePageChange={handlePageChange} 
          />
        </div>
      )}
    </section>
  </div>
);
};

export default News;
