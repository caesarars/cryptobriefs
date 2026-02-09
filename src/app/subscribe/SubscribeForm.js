"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "../lib/analytics";

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    trackEvent("view_subscribe");
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    trackEvent("subscribe_submit", { placement: "subscribe_page" });

    try {
      const response = await fetch(
        "https://ces.dbrata.my.id/api/newsletter/join",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Subscription failed.");
      }

      setStatus("success");
      setMessage("You’re in. Check your inbox (and spam) for the next brief.");
      setEmail("");
      trackEvent("subscribe_success", { placement: "subscribe_page" });
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
      trackEvent("subscribe_error", { placement: "subscribe_page" });
    }
  };

  return (
    <form className="subscribe-form" onSubmit={handleSubmit}>
      <label className="subscribe-field">
        Email
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          className="subscribe-input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <button
        type="submit"
        className="subscribe-button"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Submitting..." : "Join free"}
      </button>
      {message ? (
        <p
          className={
            status === "success" ? "subscribe-message success" : "subscribe-message error"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
};

export default SubscribeForm;
