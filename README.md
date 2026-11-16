# Wearby

Wearby is a dress-up diary for recording outfits and short daily reflections with Ear, a character.

Live site: TODO add Vercel URL

## Who it is for and the problem it solves

Wearby is for people who want a visual record of what they wore and how their day felt. It brings an outfit, a rating, and two short reflections into one memory.

## Primary user flow

1. **Start:** tap the opening screen to enter.
2. **Welcome:** the Home screen shows Records and saved drafts. Start a new outfit or open Create with AI.
3. **Dress Up:** choose tops, bottoms, outers, accessories, and shoes. Add a background. Save keeps a draft and shows Saved!; pressing it again removes the saved draft. Next opens Reflect.
4. **Reflect:** choose an optional star rating and write what to keep and leave from the day. Next saves the completed memory.
5. **Confirm:** view the outfit and reflection. Share its text, or edit and delete a personal record. Completing a draft removes it from the draft list.

**Calendar** shows memories by day. **Insights** shows yearly outfit counts, ratings, top color, and most-worn items. **Records** supports sorting and a long-press menu for pinning, sharing, and deletion. Home shows up to eight items per carousel, with access to the full list when there are more. Saved Memories is a separate draft carousel below Records.

## Viewing context

Mobile first, based on a 393px layout. On desktop, the app appears inside a centered phone frame. At widths of 600px and above, the frame uses `clamp(393px, 27vw, 560px)` and fills the viewport height.

## Tech stack

- Next.js 16.4.3, App Router.
- React and React DOM 19.3.0.
- Plain JavaScript and CSS. No TypeScript or Tailwind source.
- DM Sans through `next/font/google`.
- Browser localStorage for records, drafts, profile name, record metadata, and events.
- A Next.js POST route for AI requests, Undici for server HTTP, and Sharp for image processing.
- ESLint for linting. The package scripts are `dev`, `build`, `start`, and `lint`.

## Component structure

`app/page.js` switches screens using React state and connects storage to screen actions. Screens do not have separate URLs. `app/layout.js` sets the font, metadata, and app frame. The API route is `app/api/generate-shirt/route.js`.

Every file in `components/`:

| File | Purpose |
| --- | --- |
| `StartScreen.js` | Opening logo and Ear; enters Home. |
| `WelcomeScreen.js` | Home collage, start actions, Records, and draft carousels. |
| `DressUpScreen.js` | Clothing selection, category gestures, background picker, draft save, and leave warning. |
| `ReflectionScreen.js` | Rating, two reflection fields, and save error message. |
| `ConfirmScreen.js` | Completed memory, success feedback, text sharing, editing, and deletion. |
| `CalendarScreen.js` | Month and year controls, daily thumbnails, and selected memory details. |
| `InsightsScreen.js` | Yearly counts, rating distribution, top color, and clothing ranking. |
| `past-memories-screen.js` | Full Records or draft list; record preview and pin/share/delete menu. |
| `profile-screen.js` | Local name editing and Coming soon dialogs. |
| `Character.js` | Layers clothing over Ear using item placement settings. |
| `BackgroundSheet.js` | Camera/gallery input and built-in background selection. |
| `ai-shirt-dialog.js` | Photo/text input, estimated progress, errors, and generated clothing preview. |
| `NavBar.js` | Home, Calendar, Insights, and Profile navigation. |
| `NavIcon.js` | Navigation SVGs with an icon-file fallback. |
| `GlassIcons.js` | Button icons and a hook that samples background brightness. |
| `Icon.js` | CSS mask wrapper for files in `public/icons/`. |
| `Star.js` | Filled or outlined rating star. |
| `Confetti.js` | Temporary celebration after saving a new completed memory. |

`data/` holds clothing IDs and placement, thumbnail ratios, backgrounds, navigation paths, and sample memories. `lib/memories.js` handles browser storage. `lib/custom-clothes.js` resolves built-in and generated items. `lib/image.js` reduces uploaded photos. `lib/events.js` handles local logs. `lib/ai-shirt.js` calls the AI service and renders clothing.

## AI features

Create with AI accepts a description, a photo, or both. The client sends these to `/api/generate-shirt` when Generate is pressed. The server sends the description, an optional resized JPEG, the clothing catalog, and instructions to an OpenAI-compatible Chat Completions service.

The default service is Duke's LiteLLM gateway at `https://litellm.oit.duke.edu/v1`. `OPENAI_BASE_URL` can change it. The default model name in code is `GPT 4.1 Mini`. The photo is resized to fit within 512 by 512 pixels and sent with low image detail. The response is capped at 150 output tokens.

The model selects an existing clothing template, two colors, and one pattern: solid, stripes, dots, or checks. Sharp applies the colors and pattern to that template. This does not generate new garment shapes. Unsupported or unclear garments return an error. Generated PNGs are stored with saved outfits in the browser.

| Environment variable | Use |
| --- | --- |
| `WEARBY_AI_ENABLED` | Explicit server-side opt-in for the AI endpoint. |
| `LITELLM_API_KEY` | Preferred server-side API credential. |
| `OPENAI_API_KEY` | Fallback credential if the LiteLLM key is absent. It does not change the service URL. |
| `OPENAI_BASE_URL` | Optional service URL override. |
| `WEARBY_AI_MODEL` | Optional model name override. |

The endpoint requires the enable flag to equal the literal `true` and at least one API credential. It rejects requests with a different Origin. It allows three attempts per hour and one concurrent request per server process, with a 45-second timeout for generation. Some connection failures refund an attempt.

**The rate limit lives in server memory and is not reliable on a public deployment.** Instances do not share it, and restarts reset it. It is not a spending cap or a per-user quota. There is no authentication on this endpoint.

## Run locally

Use Node.js and npm. The repository does not pin a Node version.

```sh
npm install
npm run dev
```

Open `http://localhost:3000`.

The app's non-AI features need no environment variables. To enable AI, copy `.env.example` to `.env.local`, configure the enable flag and one credential, and optionally set the service and model overrides. Restart the dev server after changing them.

Environment names:

```text
WEARBY_AI_ENABLED
LITELLM_API_KEY
OPENAI_API_KEY
OPENAI_BASE_URL
WEARBY_AI_MODEL
```

Keep credentials server-side. Do not add a `NEXT_PUBLIC_` prefix or commit `.env.local`.

```sh
npm run lint
npm run build
npm start
```

`npm start` requires a completed build. AI needs a running server and access to the configured gateway; a static-only host cannot run it.

## Local event log

The new log uses localStorage key `wearby-events`. Each entry is `{ type, time }`, with an ISO timestamp.

- `dress_up_started`: once per Dress Up screen mount, guarded by a ref against Strict Mode's repeated effect setup.
- `outfit_saved`: after a successful draft save that sets Saved!. Failed saves and removing a draft do not log this event.

`getCompletionRate()` returns `{ started, saved, rate }`. The rate is saved divided by started, or `null` when started is zero. Storage errors are caught, and the logger does nothing on the server.

Inspect it in the browser console:

```js
JSON.parse(localStorage.getItem("wearby-events") || "[]")
```

A separate older log remains under `wearby.events`. It retains the last 200 events. It counts new outfit starts from Home and successful new completed memories after Reflect. Its `saveCompletionRate()` returns a ratio or `null`. These two logs measure different save actions and should not be combined.

The logs are local to one browser and origin. They do not measure unique people or aggregate usage. Returning to Dress Up counts another visit; saving repeatedly can make the new rate exceed 1. The new log has no length cap.

## Known limitations

- No accounts, database, cloud backup, or cross-device sync. Clearing browser storage removes personal records and drafts.
- Completed record storage keeps at most 60 entries. Photos and generated clothing can exhaust localStorage and cause saves to fail.
- Home, Calendar, Records, and Insights include demo memories. Insights also creates sample records for earlier months. Its numbers are not personal-only statistics.
- Calendar shows only the newest record for each day.
- Clothing uses fixed templates and one item per slot. AI cannot create a missing shape or reproduce detailed prints and logos.
- AI progress is simulated and stops at 95% until a response arrives.
- Sharing sends text, not an outfit image or a public link to the record.
- Premium and Profile support actions show Coming soon dialogs.
- Reloading returns to Start. Browser history does not navigate between the state-based screens.
- There is no automated test script in `package.json`. Lint and build do not establish full browser or accessibility coverage.

## What I would improve next

- Separate demo data from personal statistics.
- Choose one definition of completion and consolidate the two event logs.
- Add persistent per-user AI quotas and authentication before wider use.
- Add record export and backup, with clear storage limits.
- Test saving, editing, storage failures, keyboard use, and mobile gestures automatically.

## AI disclosure

AI coding tools helped with scaffolding, components, debugging, responsive layout, and the AI shirt feature.

TODO Jade: write what I decided and changed myself.

Verification limits: source code does not establish current gateway availability, access requirements, model access, provider retention policies, account budget, or production environment settings. No live AI request was made for this documentation review. The secret scan is a pattern-based check, not proof that every possible secret is absent.
