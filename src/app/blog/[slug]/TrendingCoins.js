"use client";

import { useEffect, useState } from "react";
import "./TrendingCoins.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

const TrendingCoins = () => {
  const [coins, setCoins] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trendingUrl = API_BASE
          ? `${API_BASE}/api/coingecko/search/trending`
          : "https://api.coingecko.com/api/v3/search/trending";
        const trendingRes = await fetch(trendingUrl);
        const trendingData = await trendingRes.json();
        const ids = (trendingData?.coins || [])
          .map((coin) => coin.item.id)
          .filter(Boolean)
          .slice(0, 20);

        if (!ids.length) {
          setCoins([]);
          setStatus("empty");
          return;
        }

        const marketUrl = API_BASE
          ? `${API_BASE}/api/coingecko/coins/markets?vs_currency=usd&ids=${ids.join(",")}&price_change_percentage=24h`
          : `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(",")}&price_change_percentage=24h`;
        const marketRes = await fetch(marketUrl);
        const marketData = await marketRes.json();
        const marketById = new Map(marketData.map((coin) => [coin.id, coin]));

        const merged = ids.map((id) => {
          const market = marketById.get(id);
          return {
            id,
            name: market?.name || id,
            symbol: market?.symbol?.toUpperCase() || "",
            price: market?.current_price ?? null,
            change24h: market?.price_change_percentage_24h ?? null,
            image: market?.image || "",
          };
        });

        setCoins(merged);
        setStatus("ready");
      } catch (error) {
        console.error("Error fetching trending coins:", error);
        setStatus("error");
      }
    };

    fetchTrending();
  }, []);

  return (
    <aside className="trending-coins-wrapper" aria-label="Trending coins">
      <div className="trending-coins-card">
        <p className="trending-coins-title">Trending Coins</p>
        {status === "loading" && (
          <p className="trending-coins-status">Loading market data...</p>
        )}
        {status === "error" && (
          <p className="trending-coins-status">
            Unable to load trending coins right now.
          </p>
        )}
        {status === "empty" && (
          <p className="trending-coins-status">No trending coins found.</p>
        )}
        {status === "ready" && (
          <ul className="trending-coins-list">
            {coins.map((coin, index) => (
              <li key={`${coin.id}-${index}`} className="trending-coin-item">
                <a
                  className="trending-coin-link"
                  href={`https://www.coingecko.com/en/coins/${coin.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="trending-coin-meta">
                    <span className="trending-coin-rank">{index + 1}</span>
                    {coin.image ? (
                      <img
                        src={coin.image}
                        alt={coin.name}
                        loading="lazy"
                        className="trending-coin-image"
                      />
                    ) : null}
                    <div className="trending-coin-text">
                      <span className="trending-coin-symbol">{coin.symbol}</span>
                      <span className="trending-coin-name">{coin.name}</span>
                    </div>
                  </div>
                  <div className="trending-coin-stats">
                    <span className="trending-coin-price">
                      {coin.price !== null ? `$${coin.price.toFixed(2)}` : "—"}
                    </span>
                    <span
                      className={
                        coin.change24h !== null && coin.change24h >= 0
                          ? "trending-coin-change positive"
                          : "trending-coin-change negative"
                      }
                    >
                      {coin.change24h !== null
                        ? `${coin.change24h.toFixed(2)}%`
                        : "—"}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default TrendingCoins;
