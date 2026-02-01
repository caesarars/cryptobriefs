import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container py-4">
        <div className="row g-3 align-items-start">
          <div className="col-12 col-md-5">
            <div className="fw-bold">CryptoBriefs</div>
            <div className="mt-2 footer-muted" style={{ maxWidth: 520 }}>
              Understand crypto in 60 seconds a day. Sentiment, trends, and one clear takeaway.
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="fw-semibold">Product</div>
            <ul className="footer-list">
              <li><Link href="/brief">Brief</Link></li>
              <li><Link href="/subscribe">Subscribe</Link></li>
              <li><Link href="/blogs">Blog</Link></li>
              <li><Link href="/news">News</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <div className="fw-semibold">Business</div>
            <ul className="footer-list">
              <li><Link href="/advertise">Advertise</Link></li>
              <li><Link href="/disclosure">Disclosure</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
              <li><a href="mailto:hello@cryptobriefs.net">hello@cryptobriefs.net</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="d-flex flex-wrap justify-content-between gap-2 footer-muted">
          <div>© {new Date().getFullYear()} CryptoBriefs</div>
          <div>Not financial advice.</div>
        </div>
      </div>
    </footer>
  );
}
