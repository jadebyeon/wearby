import { BY_ID } from "@/data/clothes";

// Generated clothes travel with the outfit so drafts and memories stay self-contained.
export function resolveClothing(value) {
  if (typeof value === "string") return BY_ID[value];
  if (["ai-shirt", "ai-clothing"].includes(value?.kind) && typeof value.id === "string" &&
      typeof value.src === "string" && /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(value.src) && value.src.length < 500000) {
    const base = BY_ID[value.templateId || (value.kind === "ai-shirt" ? "top-tee-white" : "")];
    if (!base) return undefined;
    return { ...value, slot: base.slot, tab: base.tab, name: base.name, label: `AI ${base.label}` };
  }
  return undefined;
}
