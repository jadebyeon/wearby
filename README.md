This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Wearby AI clothes

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
