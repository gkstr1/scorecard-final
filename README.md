# Scorecard

Recruiting app for clients, jobs, candidates, interviews, and reports. The interface is a React single-page app. Data and authentication go through Supabase.

## Stack

- React 18, TypeScript, and Vite
- Tailwind CSS and shadcn/ui
- React Router
- Supabase, including the `parse-resume` and `send-client-report` edge functions

## Run

Node.js 18 or newer.

Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the Supabase dashboard (Project Settings → API). Use the publishable or anon key. Do not put the service role key in this file. `.env` is gitignored.

```bash
cp .env.example .env
npm install
npm run dev
```

The dev server listens on port 8080.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Write a production bundle to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run ESLint |

## Routes

- `/` is the landing page
- `/auth` is email and password sign-up and sign-in through `supabase.auth`
- `/dashboard` is the workspace
- any other path renders the 404 page

The dashboard loads jobs and candidates from Supabase and shows Sourcing, Candidate Pipeline, Job Management, Interview Center, Reports, and Settings. A session is optional on that route.

## Data

The browser client in `src/integrations/supabase/client.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. See `.env.example`.

`parse-resume` sends resume text to the DeepSeek chat API. It reads `DEEPSEEK_API_KEY` from the function environment. `send-client-report` emails an HTML hiring report through Resend and reads `RESEND_API_KEY`.

Candidate records can store a LinkedIn profile URL. This repository has no LinkedIn OAuth client.

## Layout

```
src/components/            feature UI; shadcn/ui primitives live under ui/
src/pages/                 route components
src/hooks/                 shared hooks, including credits
src/integrations/supabase/ client and generated database types
supabase/functions/        parse-resume and send-client-report
```

`docs-*.md` and `ACTION_PLAN.md` are planning notes. They describe work that is not all present in the running app.
