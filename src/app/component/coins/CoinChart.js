import React from "react";

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export default function CoinChart({ prices }) {
  // prices: array of [timestampMs, price]
  const pts = (prices || []).filter((p) => Array.isArray(p) && p.length >= 2);
  if (pts.length < 2) return null;

  const values = pts.map((p) => Number(p[1])).filter((x) => Number.isFinite(x));
  const min = Math.min(...values);
  const max = Math.max(...values);

  const w = 900;
  const h = 260;
  const pad = 14;

  const scaleX = (i) => pad + (i / (values.length - 1)) * (w - pad * 2);
  const scaleY = (v) => {
    if (max === min) return h / 2;
    const t = (v - min) / (max - min);
    return pad + (1 - t) * (h - pad * 2);
  };

  const d = values
    .map((v, i) => {
      const x = scaleX(i);
      const y = scaleY(v);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const latest = values[values.length - 1];
  const earliest = values[0];
  const change = ((latest - earliest) / earliest) * 100;
  const changeColor = change >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div className="rounded-3 border border-white/10 p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
        <div className="fw-semibold">Price (USD) — all time</div>
        <div className="small" style={{ color: changeColor }}>
          {change >= 0 ? "+" : ""}{change.toFixed(2)}%
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role="img" aria-label="Price chart">
        <defs>
          <linearGradient id="cgLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="transparent" />
        <path d={d} fill="none" stroke="url(#cgLine)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* Min/Max labels */}
        <text x={pad} y={pad + 10} fill="#94a3b8" fontSize="12">max ${max.toLocaleString(undefined,{maximumFractionDigits:2})}</text>
        <text x={pad} y={h - pad} fill="#94a3b8" fontSize="12">min ${min.toLocaleString(undefined,{maximumFractionDigits:2})}</text>
      </svg>
      <div className="small text-secondary">
        Tip: Use this as a quick trend view. (Not financial advice.)
      </div>
    </div>
  );
}
