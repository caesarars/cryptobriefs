'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './SignalContext.css';

export default function SignalContext() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      try {
        const res = await fetch('https://ces.dbrata.my.id/api/briefs/insight?coin=BTC&period=today');
        const json = await res.json();
        if (!alive) return;
        setData(json);
      } catch {
        // ignore
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const bullish = data?.sentimentCounts?.bullish ?? 0;
  const bearish = data?.sentimentCounts?.bearish ?? 0;
  const neutral = data?.sentimentCounts?.neutral ?? 0;
  const total = data?.totalNews ?? 0;
  const bullishPct = total ? Math.round((bullish / total) * 100) : 0;
  const noSignals = bullish === 0 && bearish === 0 && neutral === 0;
  const biasLabel = noSignals ? 'Neutral' : bullishPct >= 55 ? 'Bullish' : bullishPct <= 45 ? 'Bearish' : 'Neutral';

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
            <Link className="btn btn-outline-dark" href="/subscribe" style={{ borderRadius: 50 }}>Join newsletter</Link>
          </div>
        </div>

        {loading ? (
          <div className="signal-loading">Loading today’s signal…</div>
        ) : (
          <div className="signal-grid">
            <div className="signal-block">
              <div className="signal-kicker">Sentiment (BTC)</div>
              <div className={`signal-pill signal-pill--${biasLabel.toLowerCase()}`}>Bias: {biasLabel} ({bullishPct}%)</div>
              <div className="signal-text">
                Based on the share of bullish vs bearish headlines today.
              </div>
            </div>

            <div className="signal-block">
              <div className="signal-kicker">Top movers (24h)</div>
              {data?.movers?.length ? (
                <ul className="movers">
                  {data.movers.map((m) => (
                    <li key={m.id} className={m.change24h >= 0 ? 'up' : 'down'}>
                      <span className="sym">{m.symbol}</span>
                      <span className="chg">{m.change24h >= 0 ? '+' : ''}{Number(m.change24h).toFixed(2)}%</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="signal-text">No movers available.</div>
              )}
            </div>

            <div className="signal-block">
              <div className="signal-kicker">Why it matters</div>
              <div className="takeaway">
                <div className="takeaway-text">{data?.insight || 'Insight unavailable.'}</div>
                {data?.slug ? (
                  <div className="takeaway-meta">Source: latest brief ({data.slug})</div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
