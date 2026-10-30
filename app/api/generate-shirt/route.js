import { createShirt } from "@/lib/ai-shirt";

export const maxDuration = 60;
const MAX_BODY = 2100000;
// Prototype guard only. Serverless instances do not share this counter.
let windowStart = 0;
let attempts = 0;
let running = 0;
const reply = (body, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request) {
  if (process.env.WEARBY_AI_ENABLED !== "true" || !(process.env.LITELLM_API_KEY || process.env.OPENAI_API_KEY)) {
    return reply({ error: "AI clothes aren’t ready yet. Please try again later." }, 503);
  }
  if (request.headers.get("origin") !== new URL(request.url).origin) return reply({ error: "Please use the Wearby app." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return reply({ error: "Invalid request." }, 415);
  let body;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "Add a photo or description." }, 400);
    let bytes = 0;
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY) { await reader.cancel(); return reply({ error: "Please choose a smaller photo." }, 413); }
      chunks.push(Buffer.from(value));
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return reply({ error: "Invalid request." }, 400); }
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const photo = body?.photo;
  if (description.length > 500 || (!description && !photo) ||
      (photo != null && (typeof photo !== "string" || photo.length > 2000000 || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(photo)))) {
    return reply({ error: "Add a photo or a short description of your clothing." }, 400);
  }
  if (Date.now() - windowStart > 3600000) { windowStart = Date.now(); attempts = 0; }
  if (attempts >= 3 || running >= 1) return reply({ error: "AI is busy. Try again later." }, 429);
  attempts++;
  running++;
  try {
    const item = await createShirt({ description, photo, apiKey: process.env.LITELLM_API_KEY || process.env.OPENAI_API_KEY, signal: AbortSignal.any([request.signal, AbortSignal.timeout(45000)]) });
    return reply({ item });
  } catch (error) {
    if (error.code === "AI_CONNECTION" && error.connectionFailed) attempts = Math.max(0, attempts - 1);
    return reply({ error: ["CLOTHING_INPUT", "AI_CONNECTION"].includes(error.code) ? error.message : error.name === "TimeoutError" || error.name === "AbortError" ? "This took too long. Please try again." : "Could not create this item. Please try again." }, error.status || 502);
  } finally { running--; }
}
