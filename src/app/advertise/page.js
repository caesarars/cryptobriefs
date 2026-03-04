import "./advertise.css";
import AdvertiseForm from "./AdvertiseForm";

export const metadata = {
  title: "Advertise | CryptoBriefs",
  description:
    "Sponsor CryptoBriefs newsletter and website. Reach engaged crypto readers with newsletter sponsorships, sponsored articles, and banner placements.",
  alternates: { canonical: "https://cryptobriefs.net/advertise" },
  openGraph: {
    title: "Advertise on CryptoBriefs",
    description:
      "Reach engaged crypto readers through newsletter sponsorships, sponsored articles, and banner placements on CryptoBriefs.",
    url: "https://cryptobriefs.net/advertise",
    siteName: "CryptoBriefs",
    images: [{ url: "https://cryptobriefs.net/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advertise on CryptoBriefs",
    description: "Reach engaged crypto readers. Newsletter, articles, banner placements.",
    images: ["https://cryptobriefs.net/og-image.png"],
  },
  robots: { index: true, follow: true },
  other: { "og:logo": "/favicon.png" },
};

/* ── Availability config — update these as slots sell ─────────────────── */
const PACKAGES = [
  {
    icon: "📧",
    name: "Newsletter Sponsorship",
    price: "$50",
    per: "/week",
    desc: "One dedicated sponsor slot in the daily crypto brief. Early-adopter pricing — rates rise as the list grows.",
    avail: "open",   // "open" | "limited" | "sold"
    availLabel: "Available",
    featured: false,
    features: [
      "1 exclusive slot per send",
      "Your logo + 2–3 sentences + link",
      "Sent to our growing subscriber list",
      "7-day minimum commitment",
      "Plain-text & HTML formats",
    ],
    cta: "Newsletter Sponsorship — $50/week",
  },
  {
    icon: "✍️",
    name: "Sponsored Article",
    price: "$350",
    per: "/article",
    desc: "Educational long-form content published on the CryptoBriefs blog with clear disclosure.",
    avail: "open",
    availLabel: "Available",
    featured: true,
    features: [
      "800–1,200 word deep-dive",
      "Published on blog + newsletter mention",
      "Permanent do-follow backlink",
      "\"Sponsored\" badge — 100% transparent",
      "Social promotion included",
    ],
    cta: "Sponsored Article — $350/article",
  },
  {
    icon: "🖼️",
    name: "Website Banner",
    price: "$150",
    per: "/week",
    desc: "Banner placement across homepage and article pages. Limited to 2 active slots.",
    avail: "open",
    availLabel: "Available",
    featured: false,
    features: [
      "Homepage + article page placements",
      "728×90 or 300×250 formats",
      "Max 2 concurrent advertisers",
      "No popups, no auto-play",
      "7-day minimum",
    ],
    cta: "Website Banner — $150/week",
  },
  {
    icon: "🪙",
    name: "Coin Page Sponsor",
    price: "$100",
    per: "/week",
    desc: "Your banner on a specific coin detail page (e.g. /bitcoin, /ethereum). Highly targeted.",
    avail: "open",
    availLabel: "Available",
    featured: false,
    features: [
      "Target any 1 of 25+ coin pages",
      "High-intent audience (active traders)",
      "Logo + tagline + CTA link",
      "No competing ads on same page",
      "7-day minimum",
    ],
    cta: "Coin Page Sponsor — $100/week",
  },
];

function AvailBadge({ status, label }) {
  const cls =
    status === "open"
      ? "adv-card__avail--open"
      : status === "limited"
      ? "adv-card__avail--limited"
      : "adv-card__avail--sold";
  return (
    <span className={`adv-card__avail ${cls}`}>
      <span className="adv-card__dot" />
      {label}
    </span>
  );
}

export default function AdvertisePage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="adv-hero">
        <div className="container">
          <p className="adv-hero__eyebrow">Sponsorships & Advertising</p>
          <h1 className="adv-hero__title">
            Reach <span>engaged crypto readers</span> who actually trade
          </h1>
          <p className="adv-hero__sub">
            CryptoBriefs is a growing crypto analytics platform publishing daily market
            signals, sentiment analysis, and live coin data. Get in early — rates are
            low now and will rise as the audience scales.
          </p>
          <a href="#inquiry" className="adv-hero__cta">
            Get in touch →
          </a>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <div className="adv-stats">
        <div className="container">
          <div className="adv-stats__grid">
            <div className="adv-stat">
              <span className="adv-stat__num"><span>25+</span></span>
              <span className="adv-stat__label">Coin detail pages indexed</span>
            </div>
            <div className="adv-stat">
              <span className="adv-stat__num"><span>Daily</span></span>
              <span className="adv-stat__label">Market brief published</span>
            </div>
            <div className="adv-stat">
              <span className="adv-stat__num"><span>Early</span></span>
              <span className="adv-stat__label">Low rates, growing fast</span>
            </div>
            <div className="adv-stat">
              <span className="adv-stat__num"><span>100%</span></span>
              <span className="adv-stat__label">Disclosed sponsorships</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Packages ────────────────────────────────────────────────────── */}
      <section className="adv-packages">
        <div className="container">
          <h2 className="adv-section-title">Sponsorship Packages</h2>
          <p className="adv-section-sub">
            Transparent pricing. No hidden fees. Availability updates in real time.
          </p>

          <div className="adv-cards">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`adv-card${pkg.featured ? " adv-card--featured" : ""}`}
              >
                {pkg.featured && (
                  <span className="adv-card__popular">Most popular</span>
                )}

                <div className="adv-card__icon">{pkg.icon}</div>
                <div className="adv-card__name">{pkg.name}</div>
                <div className="adv-card__price">
                  {pkg.price}
                  <sub>{pkg.per}</sub>
                </div>
                <div className="adv-card__desc">{pkg.desc}</div>

                <AvailBadge status={pkg.avail} label={pkg.availLabel} />

                <ul className="adv-card__features">
                  {pkg.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                {pkg.avail === "sold" ? (
                  <span className="adv-card__btn adv-card__btn--disabled">
                    Currently sold out
                  </span>
                ) : (
                  <a
                    href="#inquiry"
                    className={`adv-card__btn ${pkg.featured ? "adv-card__btn--primary" : "adv-card__btn--outline"}`}
                    data-package={pkg.cta}
                  >
                    Inquire →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intake form ─────────────────────────────────────────────────── */}
      <section className="adv-form-section" id="inquiry">
        <div className="adv-form-wrap">
          <h2 className="adv-section-title" style={{ textAlign: "center", marginBottom: 8 }}>
            Send an inquiry
          </h2>
          <p className="adv-section-sub" style={{ marginBottom: 32 }}>
            Fill in the form below and we&apos;ll reply within 24 hours.
          </p>
          <AdvertiseForm />
        </div>
      </section>

      {/* ── Policy note ─────────────────────────────────────────────────── */}
      <div className="adv-policy">
        <div className="adv-policy__inner">
          We do not accept misleading promotions, unverified projects, or anything we
          wouldn&apos;t recommend to our readers. All sponsorships are clearly disclosed.
          Questions? Email{" "}
          <a href="mailto:admin@cryptobriefs.net" style={{ color: "#a78bfa" }}>
            admin@cryptobriefs.net
          </a>
          .
        </div>
      </div>
    </>
  );
}
