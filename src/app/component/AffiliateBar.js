import "./AffiliateBar.css";

/**
 * Reusable horizontal affiliate banner.
 *
 * Props:
 *   href    – affiliate URL
 *   badge   – emoji or short label shown on the left icon bubble
 *   title   – bold headline
 *   sub     – small subtext
 *   cta     – button label
 *   theme   – "orange" | "blue" | "green" | "gold"  (controls accent colour)
 *   disclaimer – optional fine-print text (defaults to "Affiliate link")
 */
const AffiliateBar = ({
  href,
  badge = "🔗",
  title,
  sub,
  cta = "Learn More →",
  theme = "orange",
  disclaimer = "Affiliate link",
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`aff-bar aff-bar--${theme}`}
      aria-label={title}
    >
      <span className="aff-bar__badge" aria-hidden="true">
        {badge}
      </span>

      <span className="aff-bar__text">
        <span className="aff-bar__title">{title}</span>
        {sub && <span className="aff-bar__sub">{sub}</span>}
      </span>

      <span className="aff-bar__right">
        <span className="aff-bar__cta">{cta}</span>
        {disclaimer && (
          <span className="aff-bar__disclaimer">{disclaimer}</span>
        )}
      </span>
    </a>
  );
};

export default AffiliateBar;
