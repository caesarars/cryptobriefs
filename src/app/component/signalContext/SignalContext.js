'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import './SignalContext.css';

function pct(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return null;
  return Math.round(Number(n));
}

function computeBias(counts, total) {
  const safeTotal = total || 1;
  const bullishPct = Math.round(((counts?.bullish || 0) / safeTotal) * 100);
  const noSignals = (counts?.bullish || 0) === 0 && (counts?.bearish || 0) === 0 && (counts?.neutral || 0) === 0;
  const label = noSignals ? 'Neutral' : bullishPct >= 55 ? 'Bullish' : bullishPct <= 45 ? 'Bearish' : 'Neutral';
  return { label, bullishPct };
}

export default function SignalContext() {
  const [sentiment, setSentiment] = useState({ counts: null, total: 0, coin: 'BTC' });
  const [movers, setMovers] = useState([]);
  const [takeaway, setTakeaway] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      try {
        // 1) Sentiment (BTC today)
        const sRes = await fetch('https://crypto-blog-backend.vercel.app/api/news/newsWithSentiment?coin=BTC&period=today');
        const sJson = await sRes.json();

        // 2) Movers from CoinGecko trending
        const tRes = await fetch('https://api.coingecko.com/api/v3/search/trending');
        const tJson = await tRes.json();
        const ids = (tJson?.coins || []).map((c) => c.item.id).slice(0, 10).join(',');
        let topMovers = [];
        if (ids) {
          const mRes = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`);
          const mJson = await mRes.json();
          topMovers = (mJson || [])
            .filter((c) => typeof c.price_change_percentage_24h === 'number')
            .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
            .slice(0, 3)
            .map((c) => ({
              id: c.id,
              symbol: (c.symbol || '').toUpperCase(),
              change24h: c.price_change_percentage_24h,
              price: c.current_price,
            }));
        }

        // 3) "Why it matters" takeaway from brief summary (latest)
        const bRes = await fetch('https://crypto-blog-backend.vercel.app/api/briefs/getSummary');
        const bJson = await bRes.json();
        const first = Array.isArray(bJson?.summary) ? bJson.summary[0] : null;

        if (!alive) return;
        setSentiment({
          counts: bJson?.error ? null : sJson?.sentimentCounts || null,
          total: (sJson?.news || []).length || 0,
          coin: 'BTC',
        });
        setMovers(topMovers);
        setTakeaway(first ? { title: first.title, content: first.content, slug: bJson.slug } : null);
      } catch (e) {
        // silent fail: keep widget minimal
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const bias = useMemo(() => computeBias(sentiment.counts, sentiment.total), [sentiment]);

  return (
    <section className="signal-context container py-4">
      <div className="signal-card">
        <div className="signal-head">
          <div>
            <h2 className="space-title signal-title">Signal & context</h2>
            <p className="signal-sub">Sentiment + movers + why it matters (today)</p>
          </div>
          <div className="signal-actions">
            <Link className="btn btn-glow" href="/brief">Read brief</Link>
            <Link className="btn btn-outline-light" style={{ borderRadius: 50 }} href="/subscribe">Subscribe</Link>
          </div>
        </div>

        {loading ? (
          <div className="signal-loading">Loading today’s signal…</div>
        ) : (
          <div className="signal-grid">
            <div className="signal-block">
              <div className="signal-kicker">Sentiment (BTC)</div>
              <div className={`signal-pill signal-pill--${bias.label.toLowerCase()}`}>Bias: {bias.label} ({bias.bullishPct}%)</div>
              <div className="signal-text">
                Based on the share of bullish vs bearish headlines today.
              </div>
            </div>

            <div className="signal-block">
              <div className="signal-kicker">Top movers (24h)</div>
              {movers?.length ? (
                <ul className="movers">
                  {movers.map((m) => (
                    <li key={m.id} className={m.change24h >= 0 ? 'up' : 'down'}>
                      <span className="sym">{m.symbol}</span>
                      <span className="chg">{m.change24h >= 0 ? '+' : ''}{m.change24h.toFixed(2)}%</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="signal-text">No movers available.</div>
              )}
            </div>

            <div className="signal-block">
              <div className="signal-kicker">Why it matters</div>
              {takeaway ? (
                <div className="takeaway">
                  <div className="takeaway-title">{takeaway.title}</div>
                  <div className="takeaway-text">{takeaway.content}</div>
                </div>
              ) : (
                <div className="signal-text">Today’s takeaway will appear after the brief is generated.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
