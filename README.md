# BookBattle — Unofficial OBOB Practice Hub

An interactive, mobile-friendly React + Vite + TypeScript prototype for Oregon Battle of the Books, with practice for all 16 titles in the 2026–27 Grades 3–5 library.

## Run locally

```bash
npm ci
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Deploy free on Cloudflare Pages

Use the Node.js version in `.node-version` locally and on Cloudflare Pages.

Create an empty GitHub repository named `bookbattle-obob`, then run these commands from the project directory. Replace `OWNER` with the GitHub account or organization that owns the repository.

```powershell
git remote add origin https://github.com/OWNER/bookbattle-obob.git
git push -u origin main
```

In Cloudflare, open **Workers & Pages**, create a **Pages** project, and connect the GitHub repository.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | Repository root (leave blank) |
| Build command | `npm run build` |
| Build output directory | `dist` |

Select **Save and Deploy**. After the build succeeds, share the project's `pages.dev` URL. Future pushes to `main` trigger a production deployment.

## Features

- Mobile-friendly book picker with title and author drills for all 16 titles and story questions for The Witch Boy
- Working solo and 15-second speed quizzes
- Correct/incorrect feedback and answer explanations
- Results and session history stored locally in the browser
- Review missed questions, question flags (local session only)
- No account, server, or database required

## IMPORTANT — question quality

All included questions are **original demo drafts**, not official OBOB questions. Before sharing competitively, have a parent/coach verify each question, answer and explanation against a legitimate copy of the book. The prototype intentionally labels questions as drafts. Do not upload copyrighted official competition question sets.

## Privacy

No backend or tracking. Session history is stored in `localStorage` on each device. Clearing browser data clears progress. No cross-device synchronization or team accounts are implemented in this MVP.

## Future work

- Admin-approved, source-referenced question bank
- Coach-managed team codes and private leaderboards
- Short-answer questions, title/author identification
- Accessible timer controls and keyboard shortcuts
- Secure backend for cross-device progress

Not affiliated with Oregon Battle of the Books.
"# bookbattle-obob" 
