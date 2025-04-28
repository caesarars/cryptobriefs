// src/components/Pagination.jsx
"use client";

import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <div className="pagination-container">
      <button
        className="pagination-btn"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ◀ Previous
      </button>

      <span className="pagination-info">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        className="pagination-btn"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next ▶
      </button>
    </div>
  );
};

export default Pagination;
