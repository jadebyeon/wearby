// Local event log. Each entry is { type, time } and is stored only in this browser.
// After launch this would be replaced by an analytics tool. Storage can throw, so every call is wrapped.
const KEY = "wearby.events";
const MAX = 200;

export function trackEvent(type) {
  if (typeof window === "undefined") return;
  try {
    const list = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    const events = Array.isArray(list) ? list : [];
    events.push({ type, time: new Date().toISOString() });
    window.localStorage.setItem(KEY, JSON.stringify(events.slice(-MAX)));
  } catch { /* Tracking must never break the app. */ }
}

// Success measure: share of started outfits that were saved.
export function saveCompletionRate() {
  try {
    const events = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    const started = events.filter((e) => e.type === "dress_up_started").length;
    const saved = events.filter((e) => e.type === "outfit_saved").length;
    return started ? saved / started : null;
  } catch { return null; }
}
