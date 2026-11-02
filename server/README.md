# Skill-TERN API

This Express API serves the React application in the repository root. Use the root [README](../README.md) as the setup and feature guide.

## Local configuration

Copy `.env.example` to `.env` and set a unique `JWT_SECRET`. To connect Supabase, run `supabase/migrations/20261102000000_skilltern_documents.sql` in the project SQL Editor, then set `SUPABASE_URL` and a server-side Supabase Secret key. Supabase is the primary shared store when configured; on its first empty run, existing local demo data is copied into it. With Supabase unset, local runs persist to `server/data/db.json`. The local JSON store is intended for a single-process demo and is not suitable for concurrent deployments. Production startup requires Supabase and stops rather than silently switching to the local file. Demo seeding runs automatically only outside production, and missing engineering skills are added to an existing demo catalog without deleting user data. `/api/health` reports the active storage mode.

The Vite development server proxies `/api` to port 5001. For production, run `npm run build` in the repository root before `npm start`; the API serves the generated `dist/` application.

## Prototype boundaries

- ERP/HR IDs are not validated against an institution.
- Internship fit is a deterministic heuristic, not an AI model.
- Chat updates use client polling rather than WebSockets.
- The older static pages in `public/` are legacy assets; the active frontend is the root React app.
