'use client';

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./FilterNews.css";

const FilterNews = ({ onHandleFilter }) => {
  const [search, setSearch] = useState("");
  const [coin, setCoin] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [filter, setFilter] = useState({});

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onHandleFilter(filter);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [filter, onHandleFilter]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setFilter((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      onHandleFilter(filter);
    }
  };

  const handleSearchIcon = () => {
    onHandleFilter(filter);
  };

  const handleCoins = (e) => {
    const value = e.target.value;
    setCoin(value);
    setFilter((prev) => ({
      ...prev,
      coin: value,
    }));
  };

  const handleSentiment = (e) => {
    const value = e.target.value;
    setSentiment(value);
    setFilter((prev) => ({
      ...prev,
      sentiment: value,
    }));
  };

  return (
    <div className="mt-5">
      <div className="wrapper_filter">
        <div className="input-group search_input">
          <input style={{border:"0.5px solid grey" , borderRadius:"6px"}}
            value={search}
            className="p-2"
            type="text"
            placeholder="Search news"
            onKeyDown={handleEnter}
            onChange={handleSearch}
          />
          <div className="input-group-append searchIcon">
            <button 
              className="btn btn-outline-secondary" 
              type="button" 
              onClick={handleSearchIcon}
            >
              <FaSearch />
            </button>
          </div>
        </div>

        <div className="container_select">
          <select className=" form-control" value={coin} onChange={handleCoins}>
            <option value="">Select Coins</option>
            <option value="BTC">Bitcoin</option>
            <option value="ETH">Ethereum</option>
            <option value="DOGE">Dogecoin</option>
            <option value="XRP">Ripple</option>
            <option value="BNB">Binance Coin</option>
            <option value="DOT">Polkadot</option>
          </select>

          <select className=" form-control" value={sentiment} onChange={handleSentiment}>
            <option value="">Select Sentiment</option>
            <option value="bearish">Bearish</option>
            <option value="bullish">Bullish</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterNews;
