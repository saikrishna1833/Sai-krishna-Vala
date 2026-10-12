# Talk to Sai RAG backend

This Vercel API retrieves approved public passages, then asks Groq to generate a concise grounded first-person answer. It is not FAQ-ID routing. `knowledge/public-corpus.json` is the canonical server-owned corpus; every public passage has a stable ID, topic, ownership, source, review date, and approval flag.

## Architecture

`POST /api/chat` validates a bounded visitor question and recent user-only history, performs bounded lexical passage retrieval (up to three passages), calls Groq only with that approved context, validates the JSON response contract, and creates citations from server-owned retrieved IDs. `GET /api/source?id=...` exposes a concise approved cited passage. The browser renders all text with `textContent`.

This small curated corpus uses transparent lexical retrieval, not vector search; no embedding provider, placeholder embedding, Vercel writable filesystem, or durable conversation store is required. Update approved passages offline, review their metadata, then redeploy to rebuild the bundled index. Do not create a public ingestion route.

## Vercel setup

The public Vercel URL currently serves the portfolio experience at `/`; this repository has no root API configuration. Create or reconfigure a separate Vercel project with **Root Directory** `backend`. Its API is `https://YOUR-BACKEND.vercel.app/api/chat`. Put only that public URL in frontend `chat-config.js`.

Set private Vercel environment variables:

- `ALLOWED_ORIGINS`: exact frontend origins, comma-separated; for GitHub Pages use `https://saikrishna1833.github.io`.
- `GROQ_API_KEY`: Groq secret, Vercel only.
- `GROQ_MODEL`: an active Groq Chat Completions model available to your account. Verify it through Groq’s Models API.

Without both Groq variables, deterministic safe mode returns an unavailable response; it never pretends to generate AI text. The API limits body/history/input/output, uses CORS as a browser policy rather than authentication, rate-limits best-effort per instance, avoids full-message logging, and uses an eight-second provider timeout. In-memory limits are not globally reliable on Vercel; add a managed edge rate limiter before high-traffic use. Provider data processing and retention are governed by Groq and Vercel account settings.

Generated responses can still be incomplete or wrong. A citation is supporting approved context, not proof of every claim. Invalid retrieval, malformed model data, outages, and unsupported facts fail safely to clarification, unsupported, or unavailable responses.
