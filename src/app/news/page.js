'use client';

import { useState, useEffect, useCallback } from "react";
import styles from "./NewsPage.module.css";

// Import semua komponen yang dibutuhkan
import ListNews from "./ListNews";
import FilterNews from "./FilterNews";
import SortNews from "./SortNews"; // Komponen yang kita buat sebelumnya
import TrendingTopics from "../component/TrendingTopics"; // Komponen baru dari artifact di kanan
import Loading from "../component/loading/Loading"; // Sebaiknya ini adalah Skeleton Loading
import Pagination from "../blogs/Pagination";

// Hook custom untuk Debounce, agar tidak memanggil API di setiap ketikan
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

// Gunakan konstanta agar konsisten
const NEWS_PER_PAGE = 9; 

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 0 });
  
  // Menggabungkan semua filter dalam satu state untuk manajemen yang lebih mudah
  const [filters, setFilters] = useState({
    coin: "",
    sentiment: "",
    search: "",
    sort: "latest", 
  });
  
  const [page, setPage] = useState(1);

  // Menerapkan debounce pada input pencarian
  const debouncedSearch = useDebounce(filters.search, 500);

  // Menggunakan useCallback untuk efisiensi dan mencegah re-render yang tidak perlu
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
      const response = await fetch(`https://ces.dbrata.my.id/api/news/news?${queryParams}`);

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch news");
      }

      const result = await response.json();
      setNews(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
      setNews([]); // Kosongkan berita jika terjadi error
    }
    setLoading(false);
  }, [page, filters.coin, filters.sentiment, filters.sort, debouncedSearch]);


  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Handler umum untuk mengubah filter dari komponen FilterNews
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); 
  };
  
  // Handler untuk mengubah urutan dari komponen SortNews
  const handleSortChange = (newSort) => {
    setFilters(prev => ({...prev, sort: newSort}));
    setPage(1);
  }

  // Handler untuk mengklik topik dari komponen TrendingTopics
  const handleTopicSelect = (topic) => {
    // Set nilai filter search dengan topik yang diklik dan reset filter lainnya
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
      
  // Ganti bagian 'return' di dalam file /news/page.js Anda dengan ini:

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
        </div>

        <div className={styles.trendingWrap}>
          <TrendingTopics onTopicSelect={handleTopicSelect} />
        </div>

        {loading && <Loading />} 
        {error && <div className="alert alert-danger text-center mt-4">{error}</div>}
        {!loading && !error && (news.length > 0 ? <ListNews data={news} /> : <div className="text-center p-5">No news found. Try different filters.</div>) }
      </div>

      {!loading && !error && pagination.totalPages > 1 && (
        <div className={styles.paginationWrap}>
          <Pagination 
            currentPage={pagination.page} 
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
