const KEY = "wearby.memories";
const MAX = 60;

// localStorage can throw (private mode, blocked storage, full). Every call is wrapped.
export function loadMemories() {
  if (typeof window === "undefined") return [];
  try {
    const list = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list.filter((memory) => !memoryMeta(memory.id).deleted) : [];
  } catch {
    return [];
  }
}

// Returns { ok, memories }. ok is false when the browser would not store it.
export function saveMemory({ outfit, background = null, rating, keep, leave, draftId = null }) {
  const entry = {
    id: String(Date.now()),
    savedAt: new Date().toISOString(),
    outfit,
    background,
    draftId,
    rating,
    keep: keep.trim(),
    leave: leave.trim(),
  };
  const memories = [entry, ...loadMemories()].slice(0, MAX);
  // Never evict existing memories to make room for a generated image or photo.
  try {
    window.localStorage.setItem(KEY, JSON.stringify(memories));
    if (draftId) {
      try {
        window.localStorage.setItem("wearby.drafts", JSON.stringify(loadDrafts().filter((d) => d.id !== draftId)));
      } catch { /* The saved memory marks this draft complete if cleanup fails. */ }
    }
    return { ok: true, memories };
  } catch {
    return { ok: false };
  }
}

export function memoryLabel(savedAt) {
  const d = new Date(savedAt);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getMonth() + 1)}/${p(d.getDate())}`;
}

// Draft outfits are separate from completed memories.
export function loadDrafts() {
  if (typeof window === "undefined") return [];
  try {
    const list = JSON.parse(window.localStorage.getItem("wearby.drafts") || "[]");
    const completed = new Set(loadMemories().map((m) => m.draftId).filter(Boolean));
    return Array.isArray(list) ? list.filter((d) => d && d.id && !completed.has(d.id) && d.outfit && typeof d.outfit === "object") : [];
  } catch { return []; }
}

export function saveDraft({ id, outfit, background }) {
  const drafts = loadDrafts();
  const entry = { id: id || crypto.randomUUID(), outfit, background, savedAt: new Date().toISOString() };
  const next = [entry, ...drafts.filter((d) => d.id !== entry.id)];
  try {
    window.localStorage.setItem("wearby.drafts", JSON.stringify(next));
    return { ok: true, drafts: next, id: entry.id };
  } catch { return { ok: false }; }
}

export function removeDraft(id) {
  try {
    const drafts = loadDrafts().filter((draft) => draft.id !== id);
    window.localStorage.setItem("wearby.drafts", JSON.stringify(drafts));
    return { ok: true, drafts };
  } catch { return { ok: false }; }
}

export function memoryMeta(id) {
  try { return JSON.parse(window.localStorage.getItem("wearby.memoryMeta") || "{}")[id] || {}; }
  catch { return {}; }
}
export function updateMemoryMeta(id, changes) {
  try {
    const all = JSON.parse(window.localStorage.getItem("wearby.memoryMeta") || "{}");
    all[id] = { ...all[id], ...changes };
    window.localStorage.setItem("wearby.memoryMeta", JSON.stringify(all));
    return true;
  } catch { return false; }
}
