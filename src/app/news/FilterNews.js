// Filename: FilterNews.js

'use client';

import { FaSearch } from "react-icons/fa";

const FilterNews = ({ onHandleFilter, initialValues }) => {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onHandleFilter({ [name]: value });
  };

  return (
    // Menggunakan Bootstrap grid system.
    // gx-3 memberikan spasi horizontal yang sedikit lebih lebar antar elemen.
    <div className="row gx-3 gy-3 align-items-center mt-4 mb-3">
      
      {/* Kolom untuk Input Pencarian */}
      {/* Di layar kecil (mobile) akan mengambil lebar penuh (12), di layar besar 3 */}
      <div className="col-12 col-md-6 col-lg-3">
        <div className="input-group">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search news..." 
            aria-label="Search news"
            name="search"
            value={initialValues.search}
            onChange={handleInputChange}
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>
      </div>

      {/* Kolom untuk Filter Koin */}
      <div className="col-6 col-md-6 col-lg-3">
        <select 
          className="form-select" 
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
      
      {/* Kolom untuk Filter Sentimen */}
      <div className="col-6 col-md-6 col-lg-3">
        <select 
          className="form-select" 
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

      {/* Kolom untuk Sort By */}
      <div className="col-12 col-md-6 col-lg-3">
        {/* Menggunakan input-group agar label dan select terlihat menyatu dan rapi */}
        <div className="input-group">
            <span className="input-group-text fw-bold">Sort by:</span>
            <select 
                id="sort-select" 
                className="form-select" 
                name="sort" // ✅ PENTING: Tambahkan 'name' agar handler berfungsi
                value={initialValues.sort} // ✅ Ganti defaultValue menjadi value agar konsisten
                onChange={handleInputChange}
            >
                <option value="latest">Latest</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
            </select>
        </div>
    </div>

    </div>
  );
};

export default FilterNews;
