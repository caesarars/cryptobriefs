// src/components/Searchbar.jsx
"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa"; 
import "./Searchbar.css";

const Searchbar = ({ searchBlog }) => {
  const [searchValue, setSearchValue] = useState("");
  const [order, setOrder] = useState("");

  const handleEnter = () => {
    searchBlog(searchValue, order);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleEnter();
    }
  };

  const handleSelectChange = (event) => {
    setOrder(event.target.value);
    searchBlog(searchValue, event.target.value);
  };

  return (
    <div className="container mt-5 p-3">
      <div className="container_search">
        <div className="input-group">
          <input
            className="form-control"
            aria-describedby="basic-addon2"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search articles..."
            onKeyDown={handleKeyDown}
          />
          <div className="input-group-append">
            <div className="btn btn-outline-secondary" type="button" onClick={handleEnter}>
              <FaSearch />
            </div>
          </div>
        </div>
        <select className="form-control order_by" value={order} onChange={handleSelectChange}>
          <option value="desc">Latest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default Searchbar;
