"use client";

import { useState } from "react";

const PACKAGES = [
  "Newsletter Sponsorship — $50/week",
  "Sponsored Article — $350/article",
  "Website Banner — $150/week",
  "Coin Page Sponsor — $100/week",
  "Custom / Multiple Packages",
];

export default function AdvertiseForm({ preselect = "" }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    package: preselect || "",
    budget: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const subject = encodeURIComponent(
      `[Advertise] ${form.package || "Inquiry"} — ${form.company || form.name}`
    );

    const body = encodeURIComponent(
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Company / Project: ${form.company || "—"}\n` +
      `Website: ${form.website || "—"}\n` +
      `Package Interest: ${form.package || "—"}\n` +
      `Budget: ${form.budget || "—"}\n\n` +
      `Message:\n${form.message}`
    );

    // Open mailto — opens email client pre-filled
    window.location.href = `mailto:admin@cryptobriefs.net?subject=${subject}&body=${body}`;

    // Show success state after a short delay
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  }

  if (sent) {
    return (
      <div className="adv-form__success">
        <div className="adv-form__success-icon">✉️</div>
        <h3>Your email client should have opened!</h3>
        <p>
          If it didn&apos;t, email us directly at{" "}
          <a href="mailto:admin@cryptobriefs.net" style={{ color: "#a78bfa" }}>
            admin@cryptobriefs.net
          </a>
          . We reply within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form className="adv-form" onSubmit={handleSubmit} noValidate>
      {/* Row 1 — name + email */}
      <div className="adv-form__row">
        <div className="adv-form__group">
          <label className="adv-form__label" htmlFor="adv-name">
            Your name *
          </label>
          <input
            id="adv-name"
            name="name"
            type="text"
            required
            placeholder="Alice"
            className="adv-form__input"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="adv-form__group">
          <label className="adv-form__label" htmlFor="adv-email">
            Email *
          </label>
          <input
            id="adv-email"
            name="email"
            type="email"
            required
            placeholder="alice@project.io"
            className="adv-form__input"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Row 2 — company + website */}
      <div className="adv-form__row">
        <div className="adv-form__group">
          <label className="adv-form__label" htmlFor="adv-company">
            Company / Project
          </label>
          <input
            id="adv-company"
            name="company"
            type="text"
            placeholder="Acme Exchange"
            className="adv-form__input"
            value={form.company}
            onChange={handleChange}
          />
        </div>
        <div className="adv-form__group">
          <label className="adv-form__label" htmlFor="adv-website">
            Website
          </label>
          <input
            id="adv-website"
            name="website"
            type="url"
            placeholder="https://acme.io"
            className="adv-form__input"
            value={form.website}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Package */}
      <div className="adv-form__group">
        <label className="adv-form__label" htmlFor="adv-package">
          Package interest *
        </label>
        <select
          id="adv-package"
          name="package"
          required
          className="adv-form__select"
          value={form.package}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select a package…
          </option>
          {PACKAGES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Budget */}
      <div className="adv-form__group">
        <label className="adv-form__label" htmlFor="adv-budget">
          Monthly budget
        </label>
        <select
          id="adv-budget"
          name="budget"
          className="adv-form__select"
          value={form.budget}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select a range…
          </option>
          <option>Under $300</option>
          <option>$300 – $700</option>
          <option>$700 – $1,500</option>
          <option>$1,500+</option>
        </select>
      </div>

      {/* Message */}
      <div className="adv-form__group">
        <label className="adv-form__label" htmlFor="adv-message">
          Tell us about your project *
        </label>
        <textarea
          id="adv-message"
          name="message"
          required
          placeholder="What are you promoting? Target dates, goals, anything else we should know…"
          className="adv-form__textarea"
          value={form.message}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="adv-form__submit"
        disabled={loading || !form.name || !form.email || !form.package || !form.message}
      >
        {loading ? "Opening email…" : "Send Inquiry →"}
      </button>

      <p className="adv-form__note">
        We'll reply within 24 hours. No spam, no unsolicited follow-ups.
      </p>
    </form>
  );
}
