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

const LOCAL_EVENTS_KEY = "wearby-events";

function readEvents() {
  if (typeof window === "undefined") return [];
  try {
    const events = JSON.parse(window.localStorage.getItem(LOCAL_EVENTS_KEY) || "[]");
    return Array.isArray(events) ? events : [];
  } catch {
    return [];
  }
}

export function logEvent(type) {
  if (typeof window === "undefined") return;
  try {
    const events = readEvents();
    events.push({ type, time: new Date().toISOString() });
    window.localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
  } catch {
    // Analytics must never interrupt dressing or saving an outfit.
  }
}

export function getCompletionRate() {
  const events = readEvents();
  const started = events.filter((event) => event?.type === "dress_up_started").length;
  const saved = events.filter((event) => event?.type === "outfit_saved").length;
  return { started, saved, rate: started === 0 ? null : saved / started };
}
