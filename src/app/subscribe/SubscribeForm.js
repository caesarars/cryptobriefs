"use client";

import { useState } from "react";

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(
        "https://crypto-blog-backend.vercel.app/api/newsletter/join",
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
      setMessage("Thanks! Check your inbox for confirmation.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <form className="subscribe-form" onSubmit={handleSubmit}>
      <label className="subscribe-field">
        Email address
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
        {status === "loading" ? "Submitting..." : "Join the newsletter"}
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
