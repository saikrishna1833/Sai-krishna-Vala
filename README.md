# Sai Krishna Vala portfolio

Plain HTML, CSS, and JavaScript portfolio with an interactive CRM Universe, illustrative CRM demos, contact experience, and an approved-answer portfolio assistant. No npm install or frontend build is required.

## Run locally

From this folder, run `python -m http.server 8000`, then open `http://localhost:8000`. Live Server in VS Code also works. Keep the root files together and preserve the script order in `index.html`, especially lowercase `universe.js`.

## Talk to Sai

The default browser-only mode needs no key or backend. It has 11 fixed, first-person approved answers. Unknown, ambiguous, unrelated, and unsupported questions use the contact fallback. Browser code verifies a backend answer against its local approved text before displaying it.

## Hosting

Deploy the root static files to GitHub Pages. The `backend` directory cannot run on GitHub Pages. It contains the existing Cloudflare Worker and an optional, separate Vercel API at `/api/chat`; use [backend/README.md](backend/README.md) for the Vercel setup. Keep `XAI_API_KEY` private in Vercel environment settings if optional xAI classification is enabled—never in frontend source or Git.
