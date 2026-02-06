const API = "https://api.coingecko.com/api/v3";

async function cgFetch(path, { revalidate = 300 } = {}) {
  const url = `${API}${path}`;
  const res = await fetch(url, {
    // Cache on the Next.js side to avoid rate limits.
    next: { revalidate },
    headers: {
      accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CoinGecko ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

export async function getCoinMarket(id) {
  const q = new URLSearchParams({
    vs_currency: "usd",
    ids: id,
    order: "market_cap_desc",
    per_page: "1",
    page: "1",
    sparkline: "false",
    price_change_percentage: "24h,7d",
  }).toString();
  const arr = await cgFetch(`/coins/markets?${q}`, { revalidate: 60 });
  return arr?.[0] || null;
}

export async function getCoinDetail(id) {
  const q = new URLSearchParams({
    localization: "false",
    tickers: "false",
    market_data: "true",
    community_data: "false",
    developer_data: "false",
    sparkline: "false",
  }).toString();
  return cgFetch(`/coins/${id}?${q}`, { revalidate: 300 });
}

export async function getCoinChartMax(id) {
  // CoinGecko public API has historical range limits. Use 365d for stability.
  const q = new URLSearchParams({ vs_currency: "usd", days: "365" }).toString();
  return cgFetch(`/coins/${id}/market_chart?${q}`, { revalidate: 3600 });
}

export function fmtUsd(n, { max = 2 } = {}) {
  if (n === null || n === undefined) return "–";
  const num = Number(n);
  if (!Number.isFinite(num)) return "–";
  return num.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: num < 1 ? Math.min(8, Math.max(2, max)) : max,
  });
}

export function fmtNum(n) {
  if (n === null || n === undefined) return "–";
  const num = Number(n);
  if (!Number.isFinite(num)) return "–";
  return num.toLocaleString();
}
