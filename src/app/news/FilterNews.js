'use client';

import { FaSearch } from "react-icons/fa";

const FilterNews = ({ onHandleFilter, initialValues }) => {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onHandleFilter({ [name]: value });
  };

  const resetFilters = () => {
    onHandleFilter({
      search: "",
      coin: "",
      sentiment: "",
      sort: "latest",
    });
  };

  return (
    <div className="news-filters">
      <div className="news-filter-group filter-search">
        <div className="input-group news-input-group news-search-group">
          <input 
            type="text" 
            className="form-control news-control" 
            placeholder="Search news..." 
            aria-label="Search news"
            name="search"
            value={initialValues.search}
            onChange={handleInputChange}
          />
          <span className="input-group-text news-addon">
            <FaSearch />
          </span>
        </div>
      </div>

      <div className="news-filter-group">
        <select 
          className="form-select news-control" 
          aria-label="Select Coin"
          name="coin"
          value={initialValues.coin}
          onChange={handleInputChange}
        >
          <option value="">All Coins</option>
          <option value="BTC">Bitcoin</option>
          <option value="ETH">Ethereum</option>
          <option value="DOGE">Dogecoin</option>
          <option value="XRP">Ripple</option>
          <option value="BNB">Binance Coin</option>
          <option value="DOT">Polkadot</option>
        </select>
      </div>
      
      <div className="news-filter-group">
        <select 
          className="form-select news-control" 
          aria-label="Select Sentiment"
          name="sentiment"
          value={initialValues.sentiment}
          onChange={handleInputChange}
        >
          <option value="">All Sentiments</option>
          <option value="bullish">Bullish</option>
          <option value="bearish">Bearish</option>
          <option value="neutral">Neutral</option>
        </select>
      </div>

      <div className="news-filter-group">
        <select 
          id="sort-select"
          className="form-select news-control" 
          aria-label="Sort News"
          name="sort"
          value={initialValues.sort}
          onChange={handleInputChange}
        >
          <option value="latest">Sort: Latest</option>
          <option value="positive">Sort: Positive</option>
          <option value="negative">Sort: Negative</option>
        </select>
      </div>

      <button type="button" className="news-clear-btn" onClick={resetFilters}>
        Clear
      </button>
    </div>
  );
};

export default FilterNews;
