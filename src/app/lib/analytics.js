import { track } from "@vercel/analytics";

function gtagSafe(...args) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag(...args);
    }
  } catch {
    // no-op
  }
}

export function trackEvent(name, props = {}) {
  try {
    track(name, props);
  } catch {
    // no-op
  }

  // Mirror events to Google tag (Ads/GA) if present.
  // Keep payload small.
  gtagSafe("event", name, {
    ...props,
    event_category: props?.event_category || "engagement",
  });

  // Optional: treat subscribe_success as a conversion (set ADS_CONVERSION_SEND_TO if you have one)
  if (name === "subscribe_success") {
    const sendTo = (typeof window !== "undefined" && window.__ADS_CONVERSION_SEND_TO) || null;
    if (sendTo) gtagSafe("event", "conversion", { send_to: sendTo });
  }
}
