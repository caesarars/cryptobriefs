"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "../../lib/analytics";

export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setVisible(y > 420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="sticky-cta" role="region" aria-label="Subscribe call to action">
      <div className="sticky-cta__inner">
        <div className="sticky-cta__text">
          <div className="sticky-cta__title">Get the 60‑second brief</div>
          <div className="sticky-cta__sub">Daily signal, no noise. Free. Unsubscribe anytime.</div>
        </div>
        <div className="sticky-cta__actions">
          <Link
            href="/subscribe"
            className="btn btn-glow"
            onClick={() => trackEvent("cta_click", { placement: "sticky", target: "subscribe" })}
          >
            Subscribe
          </Link>
          <Link
            href="/brief"
            className="btn btn-outline-light"
            style={{ borderRadius: 50 }}
            onClick={() => trackEvent("cta_click", { placement: "sticky", target: "brief" })}
          >
            Read today
          </Link>
        </div>
      </div>
    </div>
  );
}
