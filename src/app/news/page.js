'use client';

import { useState, useEffect } from "react";
import ListNews from "./ListNews";
import FilterNews from "./FilterNews";
import Loading from "../component/loading/Loading";
import Pagination from "../blogs/Pagination";
import AnalysisSentiment from "./AnalysisSentiment";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 27, totalPages: 0 });
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchNews = async () => {
          setLoading(true);
          try {
            const query = {
              page,
              limit: 100,
              coins: filters.coin || "",
              sentiment: filters.sentiment || "",
              search: filters.search || "",
            };
            
            const queryParams = new URLSearchParams(query).toString();
            const response = await fetch(`https://crypto-blog-backend.vercel.app/api/news/news?${queryParams}`);
      
            if (!response.ok) throw new Error("Failed to fetch news");
      
            const result = await response.json();
            setNews(result.data);
            setPagination(result.pagination);
          } catch (err) {
            setError(err.message);
          }
          setLoading(false);
        };
      
        fetchNews();
      }, [filters, page]);

      const handleFilter = (values) => {
        setFilters(values);
        setPage(1); // reset ke 1
      };
      
      const handlePageChange = (newPage) => {
        setPage(newPage);
      };
      

  return (
    <>
      <div className="container mb-5">
        <FilterNews onHandleFilter={handleFilter} />
        <AnalysisSentiment data={pagination.data}/>
        {loading ? <Loading /> : <ListNews data={news} />}
      </div>
      <Pagination 
        currentPage={pagination.page} 
        totalPages={pagination.totalPages} 
        handlePageChange={handlePageChange} 
      />
    </>
  );
};

export default News;
