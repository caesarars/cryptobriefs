import Image from "next/image";
import CoinChart from "@/app/component/coins/CoinChart";
import { getCoinChartMax, getCoinDetail, getCoinMarket, fmtNum, fmtUsd } from "@/app/lib/coingecko";

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
    description: `Live ${name} price (USD), key stats, and all-time chart. Not financial advice.`,
    alternates: { canonical: `https://cryptobriefs.net/${slug}` },
  };
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

  const changeColor = (v) => (Number(v) >= 0 ? "#22c55e" : "#ef4444");

  return (
    <div className="bg-dark" style={{ minHeight: "100vh" }}>
      <div className="container py-5" style={{ color: "white", maxWidth: 1100 }}>
        <div className="alert alert-secondary" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "#cbd5e1" }}>
          Chart shows the last <b>365 days</b> (public data limit). Not financial advice.
        </div>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            {img ? (
              <Image src={img} alt={name} width={44} height={44} style={{ borderRadius: 12 }} />
            ) : null}
            <div>
              <h1 className="h3 m-0" style={{ fontWeight: 800 }}>{name} <span className="text-secondary">({symbol})</span></h1>
              <div className="text-secondary small">Live price + key stats • Not financial advice</div>
            </div>
          </div>

          <div className="text-end">
            <div className="h4 m-0" style={{ fontWeight: 800 }}>{fmtUsd(price)}</div>
            <div className="small text-secondary">
              24h: <span style={{ color: changeColor(change24h) }}>{(Number(change24h) >= 0 ? "+" : "") + (Number(change24h)||0).toFixed(2)}%</span>
              <span className="mx-2">•</span>
              7d: <span style={{ color: changeColor(change7d) }}>{(Number(change7d) >= 0 ? "+" : "") + (Number(change7d)||0).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <CoinChart prices={chart?.prices || []} />
          </div>
          <div className="col-12 col-lg-4">
            <div className="rounded-3 border border-white/10 p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="fw-semibold mb-2">Key stats</div>
              <div className="d-flex justify-content-between py-1"><span className="text-secondary">Market cap</span><span>{fmtUsd(market?.market_cap, { max: 0 })}</span></div>
              <div className="d-flex justify-content-between py-1"><span className="text-secondary">24h volume</span><span>{fmtUsd(market?.total_volume, { max: 0 })}</span></div>
              <div className="d-flex justify-content-between py-1"><span className="text-secondary">Circulating supply</span><span>{fmtNum(market?.circulating_supply)}</span></div>
              <div className="d-flex justify-content-between py-1"><span className="text-secondary">Max supply</span><span>{market?.max_supply ? fmtNum(market.max_supply) : "–"}</span></div>
              <div className="d-flex justify-content-between py-1"><span className="text-secondary">All-time high</span><span>{fmtUsd(detail?.market_data?.ath?.usd)}</span></div>
              <div className="d-flex justify-content-between py-1"><span className="text-secondary">ATL</span><span>{fmtUsd(detail?.market_data?.atl?.usd)}</span></div>
            </div>

            <div className="mt-3 rounded-3 border border-white/10 p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="fw-semibold mb-2">About</div>
              <div className="text-secondary" style={{ fontSize: 14, lineHeight: 1.5 }}>
                {detail?.description?.en
                  ? String(detail.description.en).replace(/<[^>]+>/g, "").slice(0, 320) + "…"
                  : `Learn what ${name} is, track the latest price, and review the all-time trend.`}
              </div>
              <div className="mt-2 small">
                <a href="/subscribe" className="link-info">Get the daily brief</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-secondary small mb-2">Browse coins</div>
          <div className="d-flex flex-wrap gap-2">
            {Object.keys(COINS).map((s) => (
              <a key={s} href={`/coin/${s}`} className="btn btn-outline-light btn-sm" style={{ borderRadius: 999 }}>
                {COINS[s].label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
