"use client";

import "./Contact.css";

const EMAIL = "admin@cryptobriefs.net";

export default function Contact() {
  return (
    <div className="container my-5 py-5">
      <div className="contactShell">
        <header className="contactHeader">
          <p className="contactEyebrow">Get in touch</p>
          <h1 className="contactTitle">Contact CryptoBriefs</h1>
          <p className="contactSubtitle">
            Questions, feedback, partnerships—send us an email and we’ll reply as soon as we can.
          </p>
        </header>

        <section className="contactCard" aria-label="Contact email">
          <div className="contactCardTop">
            <div>
              <div className="contactCardLabel">Email</div>
              <a className="contactEmail" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </div>
            <a className="contactCta" href={`mailto:${EMAIL}`}>
              Email us
            </a>
          </div>

          <div className="contactNote">
            Tip: include the coin/ticker, timeframe, and a link/screenshot if you’re reporting an issue.
          </div>
        </section>
      </div>
    </div>
  );
}
