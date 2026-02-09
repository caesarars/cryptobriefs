'use client';

import { useState, useEffect, useCallback } from "react";

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
  <>
    <div className="container mb-5">
      
      {/* --- MULAI PERUBAHAN DI SINI --- */}

      {/* Menggunakan Flexbox untuk layout yang lebih fleksibel */}
      {/* 'flex-column' di layar kecil, 'flex-row' di layar besar (lg) */}
      <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center mb-4 gap-3">
        
        {/* Filter sekarang akan mengambil ruang sebanyak yang dibutuhkan */}
        <div className="flex-grow-1">
          <FilterNews onHandleFilter={handleFilterChange} initialValues={filters} />
        </div>

        {/* Sort akan berada di sisi kanan */}
        
      </div>

      {/* --- AKHIR PERUBAHAN --- */}

      {/* Mengintegrasikan komponen TrendingTopics */}
      <TrendingTopics onTopicSelect={handleTopicSelect} />

      {/* Logika render yang lebih baik */}
      {loading && <Loading />} 
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {!loading && !error && (news.length > 0 ? <ListNews data={news} /> : <div className="text-center p-5">No news found. Try different filters.</div>) }
    </div>
    
    {!loading && !error && pagination.totalPages > 1 && (
      <Pagination 
        currentPage={pagination.page} 
        totalPages={pagination.totalPages} 
        handlePageChange={handlePageChange} 
      />
    )}
  </>
);
};

export default News;
