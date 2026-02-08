import React from "react";

export default function CoinChart({ prices }) {
  const pts = (prices || []).filter((p) => Array.isArray(p) && p.length >= 2);
  if (pts.length < 2) return null;

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

  // Closed path for gradient fill area
  const areaPath =
    linePath +
    ` L${scaleX(values.length - 1).toFixed(2)} ${(h - padBot).toFixed(2)}` +
    ` L${scaleX(0).toFixed(2)} ${(h - padBot).toFixed(2)} Z`;

  const latest = values[values.length - 1];
  const earliest = values[0];
  const change = ((latest - earliest) / earliest) * 100;
  const isUp = change >= 0;

  // Gridlines
  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount }, (_, i) => {
    const frac = i / (gridCount - 1);
    const val = min + frac * (max - min);
    const y = scaleY(val);
    return { y, label: `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}` };
  });

  return (
    <div className="coin-chart-card">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div className="coin-section-title m-0">Price Chart</div>
        <span className="small text-secondary">365 days</span>
      </div>
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
        {/* Horizontal grid lines */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={padX} y1={g.y} x2={w - padX} y2={g.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={w - padX} y={g.y - 5} fill="#475569" fontSize="11" textAnchor="end">{g.label}</text>
          </g>
        ))}
        {/* Area fill */}
        <path d={areaPath} fill="url(#cgArea)" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="url(#cgLine)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* Current price dot */}
        <circle cx={scaleX(values.length - 1)} cy={scaleY(latest)} r="4" fill="#06b6d4" />
        <circle cx={scaleX(values.length - 1)} cy={scaleY(latest)} r="8" fill="#06b6d4" fillOpacity="0.2" />
      </svg>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <span className="small text-secondary">
          Low: ${min.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
        <span className={`coin-badge ${isUp ? "up" : "down"}`}>
          {isUp ? "+" : ""}{change.toFixed(2)}% year
        </span>
        <span className="small text-secondary">
          High: ${max.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </div>
    </div>
  );
}
