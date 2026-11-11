# Wearby

A mobile-first dress-up diary by Jade (DESIGNTK 590, Project 2). Dress a small character, Ear, in the outfit you wore today, rate the day, write what to keep and what to leave, and look back on it later.

- **Live:** add the deployed URL here
- **Code:** https://github.com/jadebyeon/wearby

Wearby is built for the 393 px phone width. On a desktop it shows as a centered phone column.

## Core flow

1. **Start** and **Home**: see recent memories, or begin a new outfit.
2. **Dress Up**: pick items from five categories (tops, bottoms, outers, accessories, shoes), change the background, or save a draft. Create with AI makes a new item from a photo or a description.
3. **Reflect**: rate the day with stars and write what to keep and what to leave.
4. **Confirm**: the saved memory, which can be edited or deleted.
5. **Calendar**, **Insights** and **Records**: browse past outfits by day, see yearly stats (outfit count, average rating, top color, most worn), and sort or pin records.

## States

| State | Where |
|---|---|
| Loading | AI generation shows an estimated progress bar and a Cancel button |
| Error | Could not save, AI failures, unreadable photos, draft update failures |
| Empty | No memories yet (Home), No clothes saved yet (Insights) |
| Success | Saved!, Ready to wear, draft saved |

## Accessibility

Dialogs use native `<dialog>` and `role="alertdialog"` with focus handled, status messages use `aria-live`, controls have labels and visible focus styles, and animations respect `prefers-reduced-motion`.

## Code structure

- `app/page.js`: the screen state machine and tab transitions.
- `components/`: one component per screen plus shared pieces (`Character`, `Star`, `NavBar`, `BackgroundSheet`, `ai-shirt-dialog`).
- `lib/memories.js`: memories and drafts in `localStorage`. All reads and writes are wrapped in try/catch.
- `lib/events.js`: local event log (see Measurement).
- `lib/ai-shirt.js` and `app/api/generate-shirt/route.js`: the server side of Create with AI.
- `data/`: clothes, backgrounds and the placeholder records.

## Data and placeholder records

All data stays in the visitor's browser (`localStorage`); there is no account or sync. Calendar and Insights include placeholder memories so the screens can be shown with content. They are demo data, not observed usage.

## Measurement

The success measure is the **save completion rate**: outfits saved divided by outfits started. Wearby writes two events to `localStorage` under `wearby.events` as `{ type, time }`:

- `dress_up_started`: the user begins a new outfit.
- `outfit_saved`: a memory was saved.

`saveCompletionRate()` in `lib/events.js` computes the rate. The log is local and holds the last 200 events, so it only demonstrates the instrumentation. After launch it would be replaced by an analytics tool, with results used to find where people drop out of Dress Up and Reflect.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Use `npm run build` to check a production build.

## Deploy

The app deploys on Vercel from GitHub. Set the AI variables below in the Vercel project settings. Without them, Create with AI shows an error and the rest of the app works.

## AI clothes (Create with AI)

Wearby is a mobile-first outfit diary by Jade. All five Dress Up categories offer Create with AI. Add a photo or describe one item. AI chooses an existing clothing shape automatically. Unsupported clothing types show a short error instead of generating a different item. Tops, bottoms, outers, accessories, shoes and socks are supported. The AI feature reads a photo or short description and chooses two colors and a pattern. Wearby applies these to the matched clothing drawing, keeping its original silhouette, placement and seams. Supported patterns are solid, stripes, dots and checks. It does not draw new garment shapes, logos or detailed prints.

The Duke key's model list did not include image generation. This implementation uses the available `GPT 4.1 Mini` model through Chat Completions. Set these private server variables in `.env.local` and restart Next.js, or set them in Vercel for deployment.

```env
LITELLM_API_KEY=your-duke-key
OPENAI_BASE_URL=https://litellm.oit.duke.edu/v1
WEARBY_AI_MODEL=GPT 4.1 Mini
WEARBY_AI_ENABLED=true
```

Do not commit the key or use a NEXT_PUBLIC variable. The photo and description go to Duke's AI gateway only when Generate is pressed. Photos are reduced to at most 512 pixels with low-detail analysis. Each request uses one short model response capped at 150 output tokens, with no automatic retry. Only validated colors and predefined vector patterns are used to render the shirt. Generated PNGs stay with drafts and memories in this browser and do not sync across devices.

This is a private prototype. The server permits three attempts per hour and one concurrent request per process. These counters reset on cold starts and are not shared across Vercel instances. They do not guarantee a dollar budget. Duke's configured key budget applies separately. Before public use, add authentication and a shared usage limit. Closing the dialog cancels the client request but may not prevent provider charges once processing starts.

This feature requires a server and cannot run on GitHub Pages. Test it with `npm run build`. Live requests are charged to the configured Duke key.

## AI disclosure

Claude Code (Anthropic) helped build this project: it wrote and revised code, CSS and this README under my direction, and I reviewed, tested and corrected its output. The in-app AI feature above is separate: it sends the user's photo or text to Duke's AI gateway only when Generate is pressed.

## Known limitations

- Data is stored per browser and is not synced.
- The AI usage limit lives in server memory, so it is not reliable across Vercel instances.
- Create with AI only recolors existing clothing shapes.
