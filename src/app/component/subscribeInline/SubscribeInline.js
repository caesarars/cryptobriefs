"use client";

import Link from "next/link";

export default function SubscribeInline() {
  return (
    <section className="container py-4">
      <div
        className="p-4 p-md-5 rounded-4"
        style={{
          background: "linear-gradient(135deg, rgba(114,52,217,0.18), rgba(159,122,234,0.10))",
          border: "1px solid rgba(114,52,217,0.25)",
        }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div style={{ maxWidth: 760 }}>
            <h2 className="space-title mb-2">Get the 60‑second crypto brief</h2>
            <p className="mb-0" style={{ color: "#2b2b2b" }}>
              One email with sentiment + movers + a clear takeaway. No hype. No spam.
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <Link href="/subscribe" className="btn btn-glow">
              Join newsletter
            </Link>
            <Link href="/brief" className="btn btn-outline-dark" style={{ borderRadius: 50 }}>
              Read today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
