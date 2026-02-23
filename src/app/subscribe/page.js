// Server component — exports metadata; interactive logic lives in SubscribeForm

import Link from 'next/link'
import './Subscribe.css'
import SubscribeForm from './SubscribeForm'

export const metadata = {
<<<<<<< Updated upstream
  title:       'Subscribe | CryptoBriefs',
  description: 'Get the 60-second crypto brief: sentiment + movers + one clear takeaway. Free. No spam.',
}
=======
  title: "Subscribe | CryptoBriefs",
  description: "Get the 60-second crypto brief: sentiment + movers + one clear takeaway. Free. No spam. Unsubscribe anytime.",
  alternates: {
    canonical: "https://cryptobriefs.net/subscribe",
  },
  openGraph: {
    title: "Subscribe to CryptoBriefs — Daily Crypto Brief",
    description: "Get the 60-second crypto brief in your inbox: sentiment, movers, and one clear takeaway. Free. No spam.",
    url: "https://cryptobriefs.net/subscribe",
    siteName: "CryptoBriefs",
    images: [{ url: "https://cryptobriefs.net/og-image.svg", width: 1200, height: 630, alt: "CryptoBriefs Newsletter" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subscribe to CryptoBriefs — Daily Crypto Brief",
    description: "Get the 60-second crypto brief in your inbox: sentiment, movers, and one clear takeaway. Free. No spam.",
    images: ["https://cryptobriefs.net/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
>>>>>>> Stashed changes

export default function SubscribePage() {
  return (
    <div className="sub-wrapper">
      <div className="sub-card">

        {/* ── Logo ────────────────────────────────────────────────────────── */}
        <span className="sub-logo">CryptoBriefs</span>

        {/* ── Headline ────────────────────────────────────────────────────── */}
        <h1 className="sub-headline">Understand crypto in 60 seconds a day.</h1>
        <p className="sub-subheadline">
          Sentiment, top movers, and one clear takeaway — delivered free to
          your inbox every morning.
        </p>

        {/* ── What you get (free tier preview) ────────────────────────────── */}
        <ul className="sub-benefits">
          <li className="sub-benefit-item">
            <span className="sub-check">✓</span>
            <span>
              <strong>Daily brief</strong> — top stories, curated and summarized
            </span>
          </li>
          <li className="sub-benefit-item">
            <span className="sub-check">✓</span>
            <span>
              <strong>Market sentiment</strong> — bullish, bearish, or mixed
            </span>
          </li>
          <li className="sub-benefit-item">
            <span className="sub-check">✓</span>
            <span>
              <strong>Insight of the day</strong> — what it means for the market
            </span>
          </li>
        </ul>

        {/* ── Email form (client component — handles all interactive states) ─ */}
        <SubscribeForm />

        {/* ── Social proof ────────────────────────────────────────────────── */}
        <p className="sub-proof">No spam. No hype. Unsubscribe anytime.</p>

        {/* ── Link to brief ───────────────────────────────────────────────── */}
        <Link href="/brief" className="sub-brief-link">
          See what a brief looks like →
        </Link>

      </div>
    </div>
  )
}
