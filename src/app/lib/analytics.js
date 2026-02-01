import { track } from "@vercel/analytics";

export function trackEvent(name, props = {}) {
  try {
    track(name, props);
  } catch {
    // no-op
  }
}
