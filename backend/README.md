# Talk to Sai backend

The static portfolio works without a backend. It returns only the 11 fixed approved answers in `approved-faq.json`; unknown, ambiguous, unrelated, invalid, and prompt-injection-style questions receive the contact fallback at `vsaik0801@gmail.com`.

`worker.mjs` remains the Cloudflare Worker. `api/chat.mjs` is a separate Vercel Node.js Function, not a Worker upload. Both use `approved-faq.json`; keep it synchronized with browser `../approved-faq.js`.

## Deploy on Vercel

1. Import the repository and set **Root Directory** to `backend`.
2. In Project Settings → Environment Variables, set `ALLOWED_ORIGINS` to exact public frontend origins, comma-separated when needed. For GitHub Pages, use `https://saikrishna1833.github.io`.
3. Deploy. The endpoint is `https://YOUR-VERCEL-PROJECT.vercel.app/api/chat`.
4. Put only that public endpoint in `chat-config.js`, then redeploy the static GitHub Pages files.

The API accepts POST JSON only, limits request size and question length, uses exact-origin CORS, sets no-store, applies a best-effort per-instance rate limit, and times out provider calls. CORS is not authentication.

## Optional Groq matching

No provider key is required for deterministic mode. Until private Vercel variables `GROQ_API_KEY` and `GROQ_MODEL` are both configured, unmatched questions use a deterministic mock classifier and return the contact fallback.

Set `GROQ_API_KEY` only in Vercel’s private environment settings. Set `GROQ_MODEL` to a chat-completions model ID available to your Groq account; Groq’s Models API can list active IDs. Never place a key in Git, browser code, `chat-config.js`, logs, or committed configuration.

The server calls Groq’s OpenAI-compatible Chat Completions endpoint only to choose a high-confidence approved ID. It validates that ID against local approved data and returns server-owned fixed text, never raw model output. Model-based matching can still make classification mistakes, so uncertain, invalid, and unsupported matches are rejected.
