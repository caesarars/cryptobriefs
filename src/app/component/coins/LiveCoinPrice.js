'use client';

import { useEffect, useState } from 'react';

// Format USD price
function fmtUsd(n, { max = 2 } = {}) {
  if (n === null || n === undefined) return "–";
  const num = Number(n);
  if (!Number.isFinite(num)) return "–";
  return num.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: num < 1 ? Math.min(8, Math.max(2, max)) : max,
  });
}

// Map coin slugs to Binance symbols
const BINANCE_SYMBOL_MAP = {
  bitcoin: 'btcusdt',
  ethereum: 'ethusdt',
  binancecoin: 'bnbusdt',
  solana: 'solusdt',
  ripple: 'xrpusdt',
  cardano: 'adausdt',
  dogecoin: 'dogeusdt',
  tron: 'trxusdt',
  chainlink: 'linkusdt',
  avalanche: 'avaxusdt',
  'shiba-inu': 'shibusdt',
  sui: 'suiusdt',
  stellar: 'xlmusdt',
  'bitcoin-cash': 'bchusdt',
  polkadot: 'dotusdt',
  litecoin: 'ltcusdt',
  uniswap: 'uniusdt',
  near: 'nearusdt',
  pepe: '1000pepeusdt',
  aptos: 'aptusdt',
  tether: 'usdtusdt',
  'usd-coin': 'usdcusdt',
  // Coins not available on Binance will use fallback
};

export default function LiveCoinPrice({
  coinSlug,
  initialPrice,
  initialChange24h,
  initialChange7d
}) {
  const [price, setPrice] = useState(initialPrice);
  const [change24h, setChange24h] = useState(initialChange24h);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const binanceSymbol = BINANCE_SYMBOL_MAP[coinSlug];

    // If coin not available on Binance, keep initial values
    if (!binanceSymbol) {
      console.log(`${coinSlug} not available on Binance, using CoinGecko data`);
      return;
    }

    const wsUrl = `wss://stream.binance.com:9443/ws/${binanceSymbol}@ticker`;
    let ws;
    let reconnectTimeout;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log(`WebSocket connected for ${binanceSymbol}`);
          setIsLive(true);
          reconnectAttempts = 0;
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Update price (c = current price)
            if (data.c) {
              const newPrice = parseFloat(data.c);
              setPrice(newPrice);
            }

            // Update 24h change (P = price change percentage)
            if (data.P) {
              const newChange = parseFloat(data.P);
              setChange24h(newChange);
            }
          } catch (error) {
            console.error('Error parsing WebSocket data:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsLive(false);
        };

        ws.onclose = () => {
          console.log(`WebSocket disconnected for ${binanceSymbol}`);
          setIsLive(false);

          // Attempt reconnection with exponential backoff
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
            reconnectTimeout = setTimeout(connect, delay);
          }
        };
      } catch (error) {
        console.error('Error creating WebSocket:', error);
      }
    };

    connect();

    // Cleanup
    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [coinSlug]);

  return (
    <div className="coin-price-section">
      <div className={`coin-price ${
        change24h === null || change24h === undefined
          ? 'neutral'
          : change24h >= 0
            ? 'positive'
            : 'negative'
      }`}>
        {fmtUsd(price)}
        {isLive && (
          <span className="live-indicator" title="Live price from Binance">
            <span className="live-dot"></span>
          </span>
        )}
      </div>
      <div className="coin-changes">
        {change24h !== null && change24h !== undefined && (
          <span className={`coin-change-badge ${change24h >= 0 ? 'up' : 'down'}`}>
            {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% <small>24h</small>
          </span>
        )}
        {initialChange7d !== null && initialChange7d !== undefined && (
          <span className={`coin-change-badge ${initialChange7d >= 0 ? 'up' : 'down'}`}>
            {initialChange7d >= 0 ? '+' : ''}{initialChange7d.toFixed(2)}% <small>7d</small>
          </span>
        )}
      </div>
    </div>
  );
}
