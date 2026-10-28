const KEY = "wearby.memories";
const MAX = 60;

// localStorage can throw (private mode, blocked storage, full). Every call is wrapped.
export function loadMemories() {
  if (typeof window === "undefined") return [];
  try {
    const list = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// Returns { ok, memories }. ok is false when the browser would not store it.
export function saveMemory({ outfit, background = null, rating, keep, leave }) {
  const entry = {
    id: String(Date.now()),
    savedAt: new Date().toISOString(),
    outfit,
    background,
    rating,
    keep: keep.trim(),
    leave: leave.trim(),
  };
  let memories = [entry, ...loadMemories()].slice(0, MAX);
  // Photos are big. If the browser is full, drop the oldest memories until it fits.
  while (memories.length > 0) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(memories));
      return { ok: true, memories };
    } catch {
      if (memories.length === 1) break;
      memories = memories.slice(0, -1);
    }
  }
  return { ok: false, memories: [entry, ...loadMemories()].slice(0, MAX) };
}

export function memoryLabel(savedAt) {
  const d = new Date(savedAt);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getMonth() + 1)}/${p(d.getDate())}`;
}
