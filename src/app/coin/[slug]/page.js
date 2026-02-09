import Image from "next/image";
import { getCoinChartMax, getCoinDetail, getCoinMarket, fmtNum, fmtUsd } from "@/app/lib/coingecko";
import { getBinanceChart } from "@/app/lib/binance";
import CoinNewsFeed from "@/app/component/coins/CoinNewsFeed";
import LiveCoinPrice from "@/app/component/coins/LiveCoinPrice";
import "../../coin-page.css";

// Import local coin icons
import bitcoinIcon from "@/app/assets/image/bitcoin.png";
import ethereumIcon from "@/app/assets/image/ethereum.png";
import bnbIcon from "@/app/assets/image/bnb.png";
import solanaIcon from "@/app/assets/image/solana.png";
import xrpIcon from "@/app/assets/image/xrp.png";
import dogecoinIcon from "@/app/assets/image/dogecoin.png";
import polkadotIcon from "@/app/assets/image/polkadot.png";
import tetherIcon from "@/app/assets/image/tether.png";
import tronIcon from "@/app/assets/image/tron-trx-logo.png";
import cardanoIcon from "@/app/assets/image/cardano-ada-logo.png";
import usdcIcon from "@/app/assets/image/usd-coin-usdc-logo.png";
import wbtcIcon from "@/app/assets/image/wrapped-bitcoin-wbtc-icon.webp";
import chainlinkIcon from "@/app/assets/image/chainlink.png"
import lido from "@/app/assets/image/lido.svg"
import ava from "@/app/assets/image/avax.png"
import shiba from "@/app/assets/image/shiba.png"
import sui from "@/app/assets/image/sui.png"
import stellar from "@/app/assets/image/stellar.png"
import bitcoinCashIcon from "@/app/assets/image/bitcoin-cash-bch-logo.png"
import hyperliquidIcon from "@/app/assets/image/hyperliquid.webp"
import ltcIcon from "@/app/assets/image/litecoin-ltc-logo.png"
import uniswapIcon from "@/app/assets/image/uniswap-uni-logo.png"
import nearIcon from "@/app/assets/image/near-protocol-near-logo.png"
import pepeIcon from "@/app/assets/image/pepe-pepe-logo.png"
import aptosIcon from "@/app/assets/image/aptos-apt-logo.png" 

export const revalidate = 300;

const COINS = {
  bitcoin: { id: "bitcoin", label: "Bitcoin", icon: bitcoinIcon },
  ethereum: { id: "ethereum", label: "Ethereum", icon: ethereumIcon },
  tether: { id: "tether", label: "Tether", icon: tetherIcon },
  binancecoin: { id: "binancecoin", label: "BNB", icon: bnbIcon },
  solana: { id: "solana", label: "Solana", icon: solanaIcon },
  ripple: { id: "ripple", label: "XRP", icon: xrpIcon },
  "usd-coin": { id: "usd-coin", label: "USDC", icon: usdcIcon },
  cardano: { id: "cardano", label: "Cardano", icon: cardanoIcon },
  dogecoin: { id: "dogecoin", label: "Dogecoin", icon: dogecoinIcon },
  tron: { id: "tron", label: "TRON", icon: tronIcon },
  "staked-ether": { id: "staked-ether", label: "Lido Staked Ether", icon: lido },
  "wrapped-bitcoin": { id: "wrapped-bitcoin", label: "Wrapped Bitcoin", icon: wbtcIcon },
  chainlink: { id: "chainlink", label: "Chainlink" , icon: chainlinkIcon},
  avalanche: { id: "avalanche-2", label: "Avalanche", icon: ava },
  "shiba-inu": { id: "shiba-inu", label: "Shiba Inu", icon: shiba },
  sui: { id: "sui", label: "Sui", icon: sui },
  stellar: { id: "stellar", label: "Stellar", icon: stellar },
  "bitcoin-cash": { id: "bitcoin-cash", label: "Bitcoin Cash", icon: bitcoinCashIcon },
  polkadot: { id: "polkadot", label: "Polkadot", icon: polkadotIcon },
  hyperliquid: { id: "hyperliquid", label: "Hyperliquid", icon: hyperliquidIcon },
  litecoin: { id: "litecoin", label: "Litecoin", icon: ltcIcon },
  uniswap: { id: "uniswap", label: "Uniswap", icon: uniswapIcon },
  near: { id: "near", label: "NEAR Protocol", icon: nearIcon},
  pepe: { id: "pepe", label: "Pepe", icon: pepeIcon },
  aptos: { id: "aptos", label: "Aptos", icon: aptosIcon },
};

export async function generateStaticParams() {
  return Object.keys(COINS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const info = COINS[slug];
  const name = info?.label || slug;
  return {
    title: `${name} price, chart & key stats`,
    description: `Live ${name} price (USD), interactive chart, market stats, and key information. Not financial advice.`,
    alternates: { canonical: `https://cryptobriefs.net/${slug}` },
  };
}

export default async function CoinPage({ params }) {
  const slug = params.slug;
  const info = COINS[slug];

  if (!info) {
    return (
      <div className="coin-top-section">
        <div className="coin-container">
          <h1>Coin not supported</h1>
          <p>For now we only support top coins. Try /bitcoin, /ethereum, /solana, etc.</p>
        </div>
      </div>
    );
  }

  // Fetch data from Binance and CoinGecko
  const [market, detail, binanceChart] = await Promise.all([
    getCoinMarket(info.id).catch(() => null),
    getCoinDetail(info.id).catch(() => null),
    getBinanceChart(slug, 365).catch(() => null),
  ]);

  // Use Binance chart if available, otherwise fallback to CoinGecko
  let chart = binanceChart;
  let chartSource = 'Binance';

  if (!chart || !chart.prices || chart.prices.length === 0) {
    chart = await getCoinChartMax(info.id).catch(() => ({ prices: [] }));
    chartSource = 'CoinGecko';
  }

  const symbol = String(detail?.symbol || "").toUpperCase();
  const name = detail?.name || info.label;
  const img = info.icon || detail?.image?.large || detail?.image?.small || null;

  const price = market?.current_price;
  const change24h = market?.price_change_percentage_24h_in_currency;
  const change7d = market?.price_change_percentage_7d_in_currency;
  const rank = market?.market_cap_rank;

  const ath = detail?.market_data?.ath?.usd;
  const atl = detail?.market_data?.atl?.usd;
  const athChange = ath && price ? (((price - ath) / ath) * 100) : null;

  const circSupply = market?.circulating_supply;
  const maxSupply = market?.max_supply;
  const supplyPct = circSupply && maxSupply ? ((circSupply / maxSupply) * 100) : null;

  const homepage = detail?.links?.homepage?.[0] || null;
  const explorer = detail?.links?.blockchain_site?.find((u) => u && u.length > 0) || null;
  const subreddit = detail?.links?.subreddit_url || null;
  const twitter = detail?.links?.twitter_screen_name
    ? `https://x.com/${detail.links.twitter_screen_name}`
    : null;

  const rawDesc = detail?.description?.en || "";
  const cleanDesc = rawDesc.replace(/<[^>]+>/g, "");
  const shortDesc = cleanDesc.length > 600 ? cleanDesc.slice(0, 600) + "..." : cleanDesc;

  return (
    <>
      {/* Top Section - Purple Gradient */}
      <div className="coin-top-section">
        <div className="coin-container">
          {/* Disclaimer */}
          <div className="coin-disclaimer">
            Live price via Binance WebSocket. Chart from {chartSource}. Stats from CoinGecko. Not financial advice.
          </div>

          {/* Hero Card */}
          <div className="coin-hero">
            <div className="coin-hero-top">
              {img && (
                <Image
                  src={img}
                  alt={name}
                  width={56}
                  height={56}
                  className="coin-icon"
                />
              )}
              <div className="coin-title-group">
                <h1>
                  {name} <span className="coin-symbol">({symbol})</span>
                </h1>
                {rank && <div className="coin-rank">Rank #{rank}</div>}
              </div>
            </div>

            <LiveCoinPrice
              coinSlug={slug}
              initialPrice={price}
              initialChange24h={change24h}
              initialChange7d={change7d}
            />
          </div>

          {/* Chart + Stats Grid */}
          <div className="coin-grid">
            {/* Chart */}
            <div className="coin-chart-wrapper">
              <div className="coin-chart-header">
                <h2 className="coin-chart-title">Price Chart</h2>
                <span className="coin-chart-period">365 days</span>
              </div>
              <CoinChartInner prices={chart?.prices || []} />
            </div>

            {/* Stats */}
            <div className="coin-stats-wrapper">
              <h2 className="coin-stats-title">Key Statistics</h2>

              <div className="coin-stat-item">
                <span className="coin-stat-label">Market cap</span>
                <span className="coin-stat-value">{fmtUsd(market?.market_cap, { max: 0 })}</span>
              </div>

              <div className="coin-stat-item">
                <span className="coin-stat-label">24h volume</span>
                <span className="coin-stat-value">{fmtUsd(market?.total_volume, { max: 0 })}</span>
              </div>

              <div className="coin-stat-item">
                <span className="coin-stat-label">Circulating supply</span>
                <span className="coin-stat-value">{fmtNum(circSupply)}</span>
              </div>

              <div className="coin-stat-item">
                <span className="coin-stat-label">Max supply</span>
                <span className="coin-stat-value">{maxSupply ? fmtNum(maxSupply) : "Unlimited"}</span>
              </div>

              {supplyPct !== null && (
                <div className="coin-supply-progress">
                  <div className="coin-supply-info">
                    <span>Supply minted</span>
                    <span>{supplyPct.toFixed(1)}%</span>
                  </div>
                  <div className="coin-supply-bar">
                    <div
                      className="coin-supply-fill"
                      style={{ width: `${Math.min(supplyPct, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="coin-stat-item">
                <span className="coin-stat-label">All-time high</span>
                <span className="coin-stat-value">{fmtUsd(ath)}</span>
              </div>

              <div className="coin-stat-item">
                <span className="coin-stat-label">All-time low</span>
                <span className="coin-stat-value">{fmtUsd(atl)}</span>
              </div>

              {athChange !== null && (
                <div className={`coin-ath-badge ${athChange >= 0 ? 'positive' : 'negative'}`}>
                  {athChange >= 0
                    ? `Currently at all-time high territory (+${athChange.toFixed(1)}%)`
                    : `${Math.abs(athChange).toFixed(1)}% below all-time high`
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - White Background */}
      <div className="coin-bottom-section">
        <div className="coin-container">
          {/* About Section */}
          <div className="coin-about-wrapper">
            <h2 className="coin-about-title">About {name}</h2>
            <p className="coin-about-text">
              {shortDesc || `Learn what ${name} is, track the latest price, and review the all-time trend.`}
            </p>

            {(homepage || explorer || twitter || subreddit) && (
              <div className="coin-links">
                {homepage && (
                  <a href={homepage} target="_blank" rel="noopener noreferrer" className="coin-link">
                    🌐 Website
                  </a>
                )}
                {explorer && (
                  <a href={explorer} target="_blank" rel="noopener noreferrer" className="coin-link">
                    🔍 Explorer
                  </a>
                )}
                {twitter && (
                  <a href={twitter} target="_blank" rel="noopener noreferrer" className="coin-link">
                    𝕏 Twitter
                  </a>
                )}
                {subreddit && (
                  <a href={subreddit} target="_blank" rel="noopener noreferrer" className="coin-link">
                    💬 Reddit
                  </a>
                )}
                <a href="/subscribe" className="coin-link primary">
                  ✉️ Get Daily Brief
                </a>
              </div>
            )}
          </div>

          {/* Coin News Feed */}
          <CoinNewsFeed coinSymbol={symbol} coinName={name} />

          {/* Browse Other Coins */}
          <div className="coin-browse-section">
            <h2 className="coin-browse-title">Browse Other Coins</h2>
            <div className="coin-browse-grid">
              {Object.keys(COINS).map((s) => (
                <a
                  key={s}
                  href={`/${s}`}
                  className={`coin-browse-item${s === slug ? ' active' : ''}`}
                >
                  {COINS[s].label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Chart component (simplified inline version)
function CoinChartInner({ prices }) {
  const pts = (prices || []).filter((p) => Array.isArray(p) && p.length >= 2);
  if (pts.length < 2) return <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>No chart data available</div>;

  const values = pts.map((p) => Number(p[1])).filter((x) => Number.isFinite(x));
  const min = Math.min(...values);
  const max = Math.max(...values);

  const w = 900;
  const h = 280;
  const padX = 14;
  const padTop = 20;
  const padBot = 30;

  const scaleX = (i) => padX + (i / (values.length - 1)) * (w - padX * 2);
  const scaleY = (v) => {
    if (max === min) return h / 2;
    const t = (v - min) / (max - min);
    return padTop + (1 - t) * (h - padTop - padBot);
  };

  const linePath = values
    .map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i).toFixed(2)} ${scaleY(v).toFixed(2)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L${scaleX(values.length - 1).toFixed(2)} ${(h - padBot).toFixed(2)}` +
    ` L${scaleX(0).toFixed(2)} ${(h - padBot).toFixed(2)} Z`;

  const latest = values[values.length - 1];
  const earliest = values[0];
  const change = ((latest - earliest) / earliest) * 100;
  const isUp = change >= 0;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role="img" aria-label="Price chart">
        <defs>
          <linearGradient id="cgLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="cgArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7c3aed" stopOpacity="0.25" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#cgArea)" />
        <path d={linePath} fill="none" stroke="url(#cgLine)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={scaleX(values.length - 1)} cy={scaleY(latest)} r="4" fill="#06b6d4" />
        <circle cx={scaleX(values.length - 1)} cy={scaleY(latest)} r="8" fill="#06b6d4" fillOpacity="0.2" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
        <span>Low: ${min.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        <span className={`coin-change-badge ${isUp ? 'up' : 'down'}`}>
          {isUp ? "+" : ""}{change.toFixed(2)}% year
        </span>
        <span>High: ${max.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
      </div>
    </div>
  );
}
