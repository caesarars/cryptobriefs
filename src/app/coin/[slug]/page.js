import Image from "next/image";
import CoinChart from "@/app/component/coins/CoinChart";
import { getCoinChartMax, getCoinDetail, getCoinMarket, fmtNum, fmtUsd } from "@/app/lib/coingecko";
import "../coin-page.css";

export const revalidate = 300;

const COINS = {
  bitcoin: { id: "bitcoin", label: "Bitcoin" },
  ethereum: { id: "ethereum", label: "Ethereum" },
  tether: { id: "tether", label: "Tether" },
  binancecoin: { id: "binancecoin", label: "BNB" },
  solana: { id: "solana", label: "Solana" },
  ripple: { id: "ripple", label: "XRP" },
  "usd-coin": { id: "usd-coin", label: "USDC" },
  cardano: { id: "cardano", label: "Cardano" },
  dogecoin: { id: "dogecoin", label: "Dogecoin" },
  tron: { id: "tron", label: "TRON" },
  "staked-ether": { id: "staked-ether", label: "Lido Staked Ether" },
  "wrapped-bitcoin": { id: "wrapped-bitcoin", label: "Wrapped Bitcoin" },
  chainlink: { id: "chainlink", label: "Chainlink" },
  avalanche: { id: "avalanche-2", label: "Avalanche" },
  "shiba-inu": { id: "shiba-inu", label: "Shiba Inu" },
  sui: { id: "sui", label: "Sui" },
  stellar: { id: "stellar", label: "Stellar" },
  "bitcoin-cash": { id: "bitcoin-cash", label: "Bitcoin Cash" },
  polkadot: { id: "polkadot", label: "Polkadot" },
  hyperliquid: { id: "hyperliquid", label: "Hyperliquid" },
  litecoin: { id: "litecoin", label: "Litecoin" },
  uniswap: { id: "uniswap", label: "Uniswap" },
  near: { id: "near", label: "NEAR Protocol" },
  pepe: { id: "pepe", label: "Pepe" },
  aptos: { id: "aptos", label: "Aptos" },
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

function ChangeBadge({ value, label }) {
  const num = Number(value) || 0;
  const isUp = num >= 0;
  return (
    <span className={`coin-badge ${isUp ? "up" : "down"}`}>
      {label && <span style={{ opacity: 0.7, marginRight: 2 }}>{label}</span>}
      {isUp ? "+" : ""}{num.toFixed(2)}%
    </span>
  );
}

export default async function CoinPage({ params }) {
  const slug = params.slug;
  const info = COINS[slug];
  if (!info) {
    return (
      <div className="container py-5" style={{ color: "white" }}>
        <h1 className="h3">Coin not supported</h1>
        <p className="text-secondary">For now we only support top coins. Try /bitcoin, /ethereum, /solana, etc.</p>
      </div>
    );
  }

  const [market, detail, chart] = await Promise.all([
    getCoinMarket(info.id).catch(() => null),
    getCoinDetail(info.id).catch(() => null),
    getCoinChartMax(info.id).catch(() => ({ prices: [] })),
  ]);

  const symbol = String(detail?.symbol || "").toUpperCase();
  const name = detail?.name || info.label;
  const img = detail?.image?.large || detail?.image?.small || null;

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

  // Links from detail
  const homepage = detail?.links?.homepage?.[0] || null;
  const explorer = detail?.links?.blockchain_site?.find((u) => u && u.length > 0) || null;
  const subreddit = detail?.links?.subreddit_url || null;
  const twitter = detail?.links?.twitter_screen_name
    ? `https://x.com/${detail.links.twitter_screen_name}`
    : null;

  // Full description (strip HTML)
  const rawDesc = detail?.description?.en || "";
  const cleanDesc = rawDesc.replace(/<[^>]+>/g, "");
  const shortDesc = cleanDesc.length > 600 ? cleanDesc.slice(0, 600) + "..." : cleanDesc;

  return (
    <div className="bg-dark" style={{ minHeight: "100vh" }}>
      <div className="container py-4 py-md-5" style={{ color: "white", maxWidth: 1100 }}>

        {/* Disclaimer */}
        <div className="coin-disclaimer">
          Data refreshes every 5 minutes via CoinGecko. Chart shows the last 365 days (public API limit). This is not financial advice.
        </div>

        {/* ── Hero Card ───────────────────────────────── */}
        <div className="coin-hero-card">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              {img ? (
                <Image src={img} alt={name} width={52} height={52} style={{ borderRadius: 14 }} />
              ) : null}
              <div>
                <h1 className="h3 m-0" style={{ fontWeight: 800 }}>
                  {name} <span className="text-secondary" style={{ fontWeight: 500 }}>({symbol})</span>
                </h1>
                {rank && (
                  <span className="small" style={{ color: "#94a3b8" }}>
                    Rank #{rank}
                  </span>
                )}
              </div>
            </div>

            <div className="text-end">
              <div className="coin-price-tag">{fmtUsd(price)}</div>
              <div className="d-flex gap-2 justify-content-end mt-1">
                <ChangeBadge value={change24h} label="24h" />
                <ChangeBadge value={change7d} label="7d" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content ────────────────────────────── */}
        <div className="row g-4">

          {/* Left Column: Chart + About */}
          <div className="col-12 col-lg-8">
            <CoinChart prices={chart?.prices || []} />

            {/* About Section */}
            <div className="coin-about-card mt-4">
              <div className="coin-section-title">About {name}</div>
              <p className="coin-about-text m-0">
                {shortDesc || `Learn what ${name} is, track the latest price, and review the all-time trend.`}
              </p>
              {(homepage || explorer || twitter || subreddit) && (
                <div className="coin-links-grid">
                  {homepage && (
                    <a href={homepage} target="_blank" rel="noopener noreferrer" className="coin-link-btn">
                      Website
                    </a>
                  )}
                  {explorer && (
                    <a href={explorer} target="_blank" rel="noopener noreferrer" className="coin-link-btn">
                      Explorer
                    </a>
                  )}
                  {twitter && (
                    <a href={twitter} target="_blank" rel="noopener noreferrer" className="coin-link-btn">
                      X / Twitter
                    </a>
                  )}
                  {subreddit && (
                    <a href={subreddit} target="_blank" rel="noopener noreferrer" className="coin-link-btn">
                      Reddit
                    </a>
                  )}
                  <a href="/subscribe" className="coin-link-btn" style={{ borderColor: "rgba(114,52,217,0.4)", color: "#c4b5fd" }}>
                    Get Daily Brief
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="col-12 col-lg-4">
            <div className="coin-stat-card">
              <div className="coin-section-title">Key Statistics</div>

              <div className="coin-stat-row">
                <span className="coin-stat-label">Market cap</span>
                <span className="coin-stat-value">{fmtUsd(market?.market_cap, { max: 0 })}</span>
              </div>
              <div className="coin-stat-row">
                <span className="coin-stat-label">24h volume</span>
                <span className="coin-stat-value">{fmtUsd(market?.total_volume, { max: 0 })}</span>
              </div>
              <div className="coin-stat-row">
                <span className="coin-stat-label">Circulating supply</span>
                <span className="coin-stat-value">{fmtNum(circSupply)}</span>
              </div>
              <div className="coin-stat-row">
                <span className="coin-stat-label">Max supply</span>
                <span className="coin-stat-value">{maxSupply ? fmtNum(maxSupply) : "Unlimited"}</span>
              </div>

              {/* Supply Progress Bar */}
              {supplyPct !== null && (
                <div style={{ marginTop: 4, marginBottom: 8 }}>
                  <div className="d-flex justify-content-between" style={{ fontSize: 12, color: "#64748b" }}>
                    <span>Supply minted</span>
                    <span>{supplyPct.toFixed(1)}%</span>
                  </div>
                  <div className="coin-supply-bar">
                    <div className="coin-supply-fill" style={{ width: `${Math.min(supplyPct, 100)}%` }} />
                  </div>
                </div>
              )}

              <div className="coin-stat-row">
                <span className="coin-stat-label">All-time high</span>
                <span className="coin-stat-value">{fmtUsd(ath)}</span>
              </div>
              <div className="coin-stat-row">
                <span className="coin-stat-label">All-time low</span>
                <span className="coin-stat-value">{fmtUsd(atl)}</span>
              </div>

              {/* ATH Distance Indicator */}
              {athChange !== null && (
                <div className={`coin-ath-distance${athChange >= 0 ? " positive" : ""}`}>
                  {athChange >= 0
                    ? `Currently at all-time high territory (+${athChange.toFixed(1)}%)`
                    : `${Math.abs(athChange).toFixed(1)}% below all-time high`
                  }
                </div>
              )}
            </div>

            {/* Quick Info Card */}
            {!homepage && !explorer && (
              <div className="coin-about-card mt-3">
                <div className="coin-section-title">Stay Updated</div>
                <p className="coin-about-text m-0">
                  Subscribe to get daily crypto insights covering {name} and other top coins.
                </p>
                <div className="mt-2">
                  <a href="/subscribe" className="coin-link-btn" style={{ borderColor: "rgba(114,52,217,0.4)", color: "#c4b5fd" }}>
                    Get Daily Brief
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Browse Coins ────────────────────────────── */}
        <div className="mt-5">
          <div className="coin-section-title text-secondary" style={{ fontSize: 14, fontWeight: 600 }}>Browse coins</div>
          <div className="d-flex flex-wrap gap-2">
            {Object.keys(COINS).map((s) => (
              <a
                key={s}
                href={`/${s}`}
                className={`coin-browse-btn${s === slug ? " active" : ""}`}
              >
                {COINS[s].label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
