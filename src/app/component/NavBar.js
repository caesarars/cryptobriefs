'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./NavBar.css";

let tickerSnapshot = { coins: [], status: "loading" };
let tickerRequestPromise = null;

const fetchTickerOnce = async () => {
  if (tickerRequestPromise) return tickerRequestPromise;

  tickerRequestPromise = (async () => {
    try {
      const trendingRes = await fetch("https://api.coingecko.com/api/v3/search/trending");
      const trendingJson = await trendingRes.json();
      const ids = (trendingJson?.coins || [])
        .map((coin) => coin?.item?.id)
        .filter(Boolean)
        .slice(0, 10);

      if (!ids.length) {
        tickerSnapshot = { coins: [], status: "empty" };
        return tickerSnapshot;
      }

      const marketRes = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(",")}&price_change_percentage=24h`
      );
      const marketJson = await marketRes.json();
      const marketById = new Map((marketJson || []).map((coin) => [coin.id, coin]));

      const merged = ids
        .map((id) => {
          const market = marketById.get(id);
          if (!market) return null;
          return {
            id,
            symbol: market?.symbol?.toUpperCase() || id.toUpperCase(),
            price: market?.current_price ?? null,
            change24h: market?.price_change_percentage_24h ?? null,
            image: market?.image || "",
          };
        })
        .filter(Boolean);

      tickerSnapshot = {
        coins: merged,
        status: merged.length ? "ready" : "empty",
      };
      return tickerSnapshot;
    } catch (error) {
      console.error("Failed to load ticker coins:", error);
      tickerSnapshot = { coins: [], status: "error" };
      return tickerSnapshot;
    }
  })();

  return tickerRequestPromise;
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tickerCoins, setTickerCoins] = useState([]);
  const [tickerStatus, setTickerStatus] = useState("loading");

  useEffect(() => {
    let alive = true;

    if (tickerSnapshot.status !== "loading") {
      setTickerCoins(tickerSnapshot.coins);
      setTickerStatus(tickerSnapshot.status);
      return () => {
        alive = false;
      };
    }

    fetchTickerOnce().then((snapshot) => {
      if (!alive) return;
      setTickerCoins(snapshot.coins);
      setTickerStatus(snapshot.status);
    });

    return () => {
      alive = false;
    };
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-dropdown')) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  // Primary navigation links
  const primaryLinks = [
    ["/", "Home"],
    ["/brief", "Brief"],
    ["/subscribe", "Subscribe"],
    ["/blogs", "Blog"],
    ["/news", "News"],
    ["/airdrops", "Airdrops"],
  ];

  // Dropdown links (More menu)
  const dropdownLinks = [
    ["/signals", "Signals"],
    ["/about", "About"],
    ["/advertise", "Advertise"],
    ["/contact", "Contact"],
  ];

  const formatPrice = (price) => {
    const num = Number(price);
    if (!Number.isFinite(num)) return "—";
    if (num < 1) return `$${num.toFixed(4)}`;
    return `$${num.toFixed(2)}`;
  };

  const formatChange = (change) => {
    const num = Number(change);
    if (!Number.isFinite(num)) return "—";
    return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
  };

  const tickerList = tickerCoins.length ? [...tickerCoins, ...tickerCoins] : [];

  return (
    <>
      <nav
        className="navbar navbar-expand-lg px-4 py-3 wrapper_nav_3"
        style={{ backgroundColor: "black", color: "white" }}
      >
        <div className="container-fluid wrapper_inside d-flex justify-content-between align-items-center">
          <Link
            href="/"
            className="navbar-brand fw-bold space-title text-white brand-title"
          >
            Crypto Briefs
          </Link>

          <button
            className="navbar-toggler text-white"
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarNav"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>

        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          id="navbarNav"
          style={{ borderRadius: "10px", marginTop: "0.5rem" }}
        >
          <ul className="navbar-nav general-font ms-auto nav-links">
            {/* Primary Links */}
            {primaryLinks.map(([href, label]) => (
              <li key={label} className="nav-item">
                <Link href={href} className="nav-link text-white">
                  {label}
                </Link>
              </li>
            ))}

            {/* Dropdown Menu */}
            <li className="nav-item nav-dropdown">
              <button
                className="nav-link text-white nav-dropdown-toggle"
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
              >
                More <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
              </button>

              {dropdownOpen && (
                <ul className="nav-dropdown-menu">
                  {dropdownLinks.map(([href, label]) => (
                    <li key={label}>
                      <Link href={href} className="nav-dropdown-item">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <div className="nav-ticker-row" aria-label="Trending coins ticker">
        {tickerStatus === "ready" ? (
          <div className="ticker-viewport">
            <div className="ticker-track">
              {tickerList.map((coin, index) => (
                <a
                  key={`${coin.id}-${index}`}
                  className="ticker-item"
                  href={`https://www.coingecko.com/en/coins/${coin.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {coin.image ? (
                    <img
                      src={coin.image}
                      alt={coin.symbol}
                      className="ticker-icon"
                      loading="lazy"
                    />
                  ) : null}
                  <span className="ticker-symbol">{coin.symbol}</span>
                  <span className="ticker-price">{formatPrice(coin.price)}</span>
                  <span
                    className={
                      Number.isFinite(Number(coin.change24h))
                        ? coin.change24h >= 0
                          ? "ticker-change up"
                          : "ticker-change down"
                        : "ticker-change neutral"
                    }
                  >
                    {formatChange(coin.change24h)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ) : tickerStatus === "loading" ? (
          <div className="ticker-viewport" aria-hidden="true">
            <div className="ticker-track">
              {Array.from({ length: 12 }).map((_, idx) => (
                <span key={idx} className="ticker-item ticker-skeleton-item" />
              ))}
            </div>
          </div>
        ) : (
          <div className="ticker-fallback">
            Trending coins unavailable
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
