// src/app/blogs/page.jsx
"use client";

import { useEffect, useState } from "react";
import Searchbar from "./Searchbar"
import ListBlogs from "./ListBlogs";
import Loading from "../component/loading/Loading";
import Pagination from "./Pagination";
import "./Blogs.css"
import { api } from "../lib/backend";

const Blogs = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlog, setTotalBlog] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [featured, setFeatured] = useState(null);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");

  const getBlogs = async (search, order, page, append = false) => {
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      order: order || "desc",
      search: search || "",
      page: page || 1,
      limit: 12,
    }).toString();

    setSearch(search);
    setOrder(order);

    try {
      const response = await fetch(
        api(`/api/getBlog?${queryParams}`)
      );
      const data = await response.json();
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setTotalBlog(data.totalBlogs);

      if (!append) {
        setBlogs(data.data);
        setFeatured(data.data?.[0] || null);
      } else {
        setBlogs((prev) => [...(prev || []), ...(data.data || [])]);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchBlog = (searchValue, order) => {
    getBlogs(searchValue, order);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      getBlogs(search, order, newPage);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      setCurrentPage(nextPage);
      getBlogs(search, order, nextPage, true);
    }
  };

  useEffect(() => {
    getBlogs("", "desc", 1);
  }, []);

  return (
    <>
      <Searchbar searchBlog={handleSearchBlog} />
      <div className="mb-5">
        {isLoading ? <Loading /> : <ListBlogs blogs={blogs || []} featured={featured} />}
      </div>

      {currentPage < totalPages && (
        <div className="d-flex justify-content-center mb-4">
          <button className="btn btn-glow" onClick={handleLoadMore}>
            Load more
          </button>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </>
  );
};

export default Blogs;
