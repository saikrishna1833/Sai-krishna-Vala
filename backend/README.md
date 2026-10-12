# Talk to Sai backend

The static portfolio works without a backend. It returns only the 11 fixed approved answers in `approved-faq.json`; unknown, ambiguous, unrelated, and prompt-injection-style questions receive the contact fallback.

`worker.mjs` remains the Cloudflare Worker. `api/chat.mjs` is a separate Vercel Node.js Function, not a Worker upload. Both use `approved-faq.json`; keep it synchronized with browser `../approved-faq.js`.

## Deploy on Vercel

1. Import the repository and set **Root Directory** to `backend`.
2. In Project Settings → Environment Variables, set `ALLOWED_ORIGINS` to exact public frontend origins, for example `https://saikrishna1833.github.io`.
3. Deploy. The endpoint is `https://YOUR-VERCEL-PROJECT.vercel.app/api/chat`.
4. Put only that public endpoint in `chat-config.js`, then redeploy the static GitHub Pages files.

No API key is required. The API accepts POST JSON only, limits request size and question length, uses exact-origin CORS, sets no-store, applies a best-effort per-instance rate limit, and times out provider calls. CORS is not authentication.

## Optional xAI matching

Until private Vercel variables `XAI_API_KEY` and `XAI_MODEL` are both configured, unmatched questions use a deterministic mock classifier and fall back. Never place an API key in Git, browser code, `chat-config.js`, logs, or committed configuration.

With xAI configured, the model only selects a high-confidence approved ID. The function validates that ID and returns server-owned fixed text, never raw model output. Model-based matching can still make classification mistakes, so uncertain, invalid, and unsupported matches are rejected.
