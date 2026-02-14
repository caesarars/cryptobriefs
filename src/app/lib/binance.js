// Binance API utilities

// Map coin slugs to Binance symbols
const BINANCE_SYMBOL_MAP = {
  bitcoin: 'BTCUSDT',
  ethereum: 'ETHUSDT',
  binancecoin: 'BNBUSDT',
  solana: 'SOLUSDT',
  ripple: 'XRPUSDT',
  cardano: 'ADAUSDT',
  dogecoin: 'DOGEUSDT',
  tron: 'TRXUSDT',
  chainlink: 'LINKUSDT',
  avalanche: 'AVAXUSDT',
  'shiba-inu': 'SHIBUSDT',
  sui: 'SUIUSDT',
  stellar: 'XLMUSDT',
  'bitcoin-cash': 'BCHUSDT',
  polkadot: 'DOTUSDT',
  litecoin: 'LTCUSDT',
  uniswap: 'UNIUSDT',
  near: 'NEARUSDT',
  pepe: '1000PEPEUSDT',
  aptos: 'APTUSDT',
  tether: 'USDTUSDT',
  'usd-coin': 'USDCUSDT',
};

/**
 * Get historical kline/candlestick data from Binance
 * @param {string} coinSlug - Coin slug (e.g., 'bitcoin')
 * @param {number} days - Number of days (default: 365, max: 1000)
 * @returns {Promise<{prices: Array}>} - Array of [timestamp, price] pairs
 */
export async function getBinanceChart(coinSlug, days = 365) {
  const symbol = BINANCE_SYMBOL_MAP[coinSlug];

  // If coin not available on Binance, return null (fallback to CoinGecko)
  if (!symbol) {
    return null;
  }

  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
    const url = API_BASE
      ? `${API_BASE}/api/binance/klines?symbol=${symbol}&interval=1d&limit=${Math.min(days, 1000)}`
      : `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=${Math.min(days, 1000)}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        accept: 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`Binance API error for ${symbol}: ${res.status}`);
      return null;
    }

    const data = await res.json();

    // Transform Binance klines format to CoinGecko-like format
    // Binance: [timestamp, open, high, low, close, volume, ...]
    // CoinGecko: [[timestamp, price], ...]
    const prices = data.map((kline) => [
      kline[0], // timestamp (open time)
      parseFloat(kline[4]), // close price
    ]);

    return { prices };
  } catch (error) {
    console.error(`Error fetching Binance chart for ${coinSlug}:`, error);
    return null;
  }
}

/**
 * Get Binance symbol for a coin slug
 * @param {string} coinSlug - Coin slug
 * @returns {string|null} - Binance symbol or null
 */
export function getBinanceSymbol(coinSlug) {
  return BINANCE_SYMBOL_MAP[coinSlug] || null;
}
