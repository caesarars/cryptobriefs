import Image from "next/image";
import CoinChart from "@/app/component/coins/CoinChart";
import { getCoinChartMax, getCoinDetail, getCoinMarket, fmtNum, fmtUsd } from "@/app/lib/coingecko";

export const revalidate = 300;

const COINS = {
  bitcoin: { id: "bitcoin", label: "Bitcoin", symbol: "BTC" },
  ethereum: { id: "ethereum", label: "Ethereum", symbol: "ETH" },
  tether: { id: "tether", label: "Tether", symbol: "USDT" },
  binancecoin: { id: "binancecoin", label: "BNB", symbol: "BNB" },
  solana: { id: "solana", label: "Solana", symbol: "SOL" },
  ripple: { id: "ripple", label: "XRP", symbol: "XRP" },
  "usd-coin": { id: "usd-coin", label: "USDC", symbol: "USDC" },
  cardano: { id: "cardano", label: "Cardano", symbol: "ADA" },
  dogecoin: { id: "dogecoin", label: "Dogecoin", symbol: "DOGE" },
  tron: { id: "tron", label: "TRON", symbol: "TRX" },
  "staked-ether": { id: "staked-ether", label: "Lido Staked Ether", symbol: "STETH" },
  "wrapped-bitcoin": { id: "wrapped-bitcoin", label: "Wrapped Bitcoin", symbol: "WBTC" },
  chainlink: { id: "chainlink", label: "Chainlink", symbol: "LINK" },
  avalanche: { id: "avalanche-2", label: "Avalanche", symbol: "AVAX" },
  "shiba-inu": { id: "shiba-inu", label: "Shiba Inu", symbol: "SHIB" },
  sui: { id: "sui", label: "Sui", symbol: "SUI" },
  stellar: { id: "stellar", label: "Stellar", symbol: "XLM" },
  "bitcoin-cash": { id: "bitcoin-cash", label: "Bitcoin Cash", symbol: "BCH" },
  polkadot: { id: "polkadot", label: "Polkadot", symbol: "DOT" },
  hyperliquid: { id: "hyperliquid", label: "Hyperliquid", symbol: "HYPE" },
  litecoin: { id: "litecoin", label: "Litecoin", symbol: "LTC" },
  uniswap: { id: "uniswap", label: "Uniswap", symbol: "UNI" },
  near: { id: "near", label: "NEAR Protocol", symbol: "NEAR" },
  pepe: { id: "pepe", label: "Pepe", symbol: "PEPE" },
  aptos: { id: "aptos", label: "Aptos", symbol: "APT" },
};

export async function generateStaticParams() {
  return Object.keys(COINS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const info = COINS[slug];
  const name = info?.label || slug;
  const sym = info?.symbol || "";
  return {
    title: `${name} (${sym}) Price Today, Live Chart & Stats`,
    description: `${name} (${sym}) live price in USD, interactive 365-day chart, market cap, volume, circulating supply, ATH, and key stats. Updated every 5 minutes.`,
    alternates: { canonical: `https://cryptobriefs.net/${slug}` },
    openGraph: {
      title: `${name} (${sym}) Price & Chart — CryptoBriefs`,
      description: `Live ${name} price, 365-day chart, and market stats.`,
      url: `https://cryptobriefs.net/${slug}`,
      type: "website",
    },
  };
}

function buildJsonLd(slug, info, market, detail) {
  const ld = [];

  // WebPage + FinancialProduct
  if (market) {
    ld.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${info.label} (${info.symbol}) Price & Stats`,
      url: `https://cryptobriefs.net/${slug}`,
      description: `Live ${info.label} price, chart, and key statistics.`,
      mainEntity: {
        "@type": "FinancialProduct",
        name: info.label,
        alternateName: info.symbol,
        url: `https://cryptobriefs.net/${slug}`,
        ...(detail?.image?.large ? { image: detail.image.large } : {}),
        offers: {
          "@type": "Offer",
          price: market.current_price,
          priceCurrency: "USD",
          availability: "https://schema.org/OnlineOnly",
        },
      },
      provider: {
        "@type": "Organization",
        name: "CryptoBriefs",
        url: "https://cryptobriefs.net",
      },
    });
  }

  // FAQPage for "People Also Ask"
  ld.push({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the current price of ${info.label}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: market
            ? `The current price of ${info.label} (${info.symbol}) is ${fmtUsd(market.current_price)} USD, updated every 5 minutes.`
            : `Visit this page for the latest ${info.label} price, updated every 5 minutes.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${info.label}'s all-time high?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: detail?.market_data?.ath?.usd
            ? `${info.label}'s all-time high is ${fmtUsd(detail.market_data.ath.usd)} USD.`
            : `Check this page for ${info.label}'s all-time high price.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${info.label}'s market cap?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: market?.market_cap
            ? `${info.label} has a market cap of ${fmtUsd(market.market_cap, { max: 0 })} USD.`
            : `Visit this page for ${info.label}'s live market cap data.`,
        },
      },
    ],
  });

  return ld;
}

// Card-style wrapper
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-3 border p-3 ${className}`}
    style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.10)" }}
  >
    {children}
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="d-flex justify-content-between py-1">
    <span className="text-secondary">{label}</span>
    <span>{value}</span>
  </div>
);

export default async function CoinPage({ params }) {
  const slug = params.slug;
  const info = COINS[slug];
  if (!info) {
    return (
      <div className="container py-5" style={{ color: "white" }}>
        <h1 className="h3">Coin not supported</h1>
        <p className="text-secondary">Try /bitcoin, /ethereum, /solana, or browse the list below.</p>
        <div className="d-flex flex-wrap gap-2 mt-3">
          {Object.keys(COINS).map((s) => (
            <a key={s} href={`/coin/${s}`} className="btn btn-outline-light btn-sm" style={{ borderRadius: 999 }}>
              {COINS[s].label}
            </a>
          ))}
        </div>
      </div>
    );
  }

  const [market, detail, chart] = await Promise.all([
    getCoinMarket(info.id).catch(() => null),
    getCoinDetail(info.id).catch(() => null),
    getCoinChartMax(info.id).catch(() => ({ prices: [] })),
  ]);

  const symbol = String(detail?.symbol || info.symbol || "").toUpperCase();
  const name = detail?.name || info.label;
  const img = detail?.image?.large || detail?.image?.small || null;

  const price = market?.current_price;
  const change24h = market?.price_change_percentage_24h_in_currency;
  const change7d = market?.price_change_percentage_7d_in_currency;
  const rank = market?.market_cap_rank;

  const changeColor = (v) => (Number(v) >= 0 ? "#22c55e" : "#ef4444");
  const fmtChange = (v) => {
    const n = Number(v) || 0;
    return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
  };

  const jsonLdItems = buildJsonLd(slug, info, market, detail);

  // Build the about text — show more content for SEO
  const rawDesc = detail?.description?.en || "";
  const cleanDesc = rawDesc.replace(/<[^>]+>/g, "");
  const aboutText = cleanDesc.length > 0
    ? cleanDesc.slice(0, 800) + (cleanDesc.length > 800 ? "..." : "")
    : `${name} (${symbol}) is a cryptocurrency you can track on CryptoBriefs. View the latest price, 365-day chart, market cap, and key stats above. Subscribe to get daily crypto insights delivered to your inbox.`;

  return (
    <div className="bg-dark" style={{ minHeight: "100vh" }}>
      {jsonLdItems.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <div className="container py-5" style={{ color: "white", maxWidth: 1100 }}>
        {/* Header */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            {img ? (
              <Image src={img} alt={name} width={48} height={48} style={{ borderRadius: 12 }} />
            ) : null}
            <div>
              <div className="d-flex align-items-center gap-2">
                <h1 className="h3 m-0" style={{ fontWeight: 800 }}>{name}</h1>
                <span className="badge text-bg-secondary" style={{ fontSize: 13 }}>{symbol}</span>
                {rank && (
                  <span className="badge" style={{ fontSize: 11, background: "rgba(124,58,237,0.3)", color: "#c4b5fd" }}>
                    Rank #{rank}
                  </span>
                )}
              </div>
              <div className="text-secondary small mt-1">Live price + key stats — updated every 5 min</div>
            </div>
          </div>

          <div className="text-end">
            <div className="h3 m-0" style={{ fontWeight: 800 }}>{fmtUsd(price)}</div>
            <div className="small text-secondary mt-1">
              <span style={{ color: changeColor(change24h) }}>{fmtChange(change24h)}</span>
              <span className="text-secondary mx-1">24h</span>
              <span className="mx-2">|</span>
              <span style={{ color: changeColor(change7d) }}>{fmtChange(change7d)}</span>
              <span className="text-secondary mx-1">7d</span>
            </div>
          </div>
        </div>

        {/* Chart + Sidebar */}
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <Card>
              <div className="small text-secondary mb-2">365-day price chart (USD) — Not financial advice</div>
              <CoinChart prices={chart?.prices || []} />
            </Card>
          </div>

          <div className="col-12 col-lg-4 d-flex flex-column gap-3">
            {/* Key stats */}
            <Card>
              <div className="fw-semibold mb-2">{name} key stats</div>
              <StatRow label="Market cap" value={fmtUsd(market?.market_cap, { max: 0 })} />
              <StatRow label="24h volume" value={fmtUsd(market?.total_volume, { max: 0 })} />
              <StatRow label="Circulating supply" value={fmtNum(market?.circulating_supply)} />
              <StatRow label="Max supply" value={market?.max_supply ? fmtNum(market.max_supply) : "No limit"} />
              <StatRow label="Fully diluted valuation" value={fmtUsd(market?.fully_diluted_valuation, { max: 0 })} />
              <hr style={{ borderColor: "rgba(255,255,255,0.08)", margin: "8px 0" }} />
              <StatRow label="All-time high" value={fmtUsd(detail?.market_data?.ath?.usd)} />
              <StatRow label="All-time low" value={fmtUsd(detail?.market_data?.atl?.usd)} />
            </Card>

            {/* Subscribe CTA */}
            <Card className="text-center">
              <div className="fw-semibold mb-1">Get the daily brief</div>
              <p className="text-secondary small mb-3">
                {name} price moves + market sentiment in 60 seconds. Free, every morning.
              </p>
              <a
                href="/subscribe"
                className="btn w-100"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: 999,
                }}
              >
                Subscribe free
              </a>
            </Card>
          </div>
        </div>

        {/* About section — longer for SEO */}
        <Card className="mt-4">
          <h2 className="h5 fw-semibold mb-2">About {name} ({symbol})</h2>
          <div className="text-secondary" style={{ fontSize: 14, lineHeight: 1.7 }}>
            {aboutText}
          </div>
        </Card>

        {/* FAQ section — targets "People Also Ask" */}
        <div className="mt-4">
          <h2 className="h5 fw-semibold mb-3">Frequently asked questions</h2>
          <div className="d-flex flex-column gap-2">
            <Card>
              <div className="fw-semibold mb-1">What is the current price of {name}?</div>
              <div className="text-secondary small">
                The current price of {name} ({symbol}) is {fmtUsd(price)} USD. This page updates every 5 minutes with live data from CoinGecko.
              </div>
            </Card>
            <Card>
              <div className="fw-semibold mb-1">What is {name}&apos;s all-time high?</div>
              <div className="text-secondary small">
                {name}&apos;s all-time high is {fmtUsd(detail?.market_data?.ath?.usd)} USD. You can track how close the current price is to the ATH using the chart and stats above.
              </div>
            </Card>
            <Card>
              <div className="fw-semibold mb-1">What is {name}&apos;s market cap?</div>
              <div className="text-secondary small">
                {name} currently has a market cap of {fmtUsd(market?.market_cap, { max: 0 })} USD{rank ? `, ranking #${rank} among all cryptocurrencies` : ""}. Market cap is calculated by multiplying the current price by circulating supply.
              </div>
            </Card>
          </div>
        </div>

        {/* Browse coins */}
        <div className="mt-5">
          <div className="text-secondary small mb-2">Browse coins</div>
          <div className="d-flex flex-wrap gap-2">
            {Object.keys(COINS).map((s) => (
              <a
                key={s}
                href={`/coin/${s}`}
                className={`btn btn-sm ${s === slug ? "btn-light" : "btn-outline-light"}`}
                style={{ borderRadius: 999 }}
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
