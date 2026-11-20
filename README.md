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
- Anonymous practice works without a database. Shared student progress uses Cloudflare D1.

## IMPORTANT — question quality

All included questions are **original demo drafts**, not official OBOB questions. Before sharing competitively, have a parent/coach verify each question, answer and explanation against a legitimate copy of the book. The prototype intentionally labels questions as drafts. Do not upload copyrighted official competition question sets.

## Shared student progress and admin setup

1. Create a Cloudflare D1 database for BookBattle and run the SQL in `schema.sql` in its console.
2. In the existing Pages project settings, bind that database to Production as `PROGRESS_DB`.
3. Add a Production secret named `ADMIN_RESET_KEY` with a long, randomly generated value. Keep it in your password manager and out of Git.
4. Deploy the updated code after saving the binding and secret. Open `/admin`, select **Set or reset password**, enter the reset key, and set an admin password of at least 12 characters. Use the same reset form to change it later.

Students can save a first name or nickname from the book library. This shares the current reading checklist and future quiz scores. Each browser profile is tracked separately. The admin dashboard shows finished titles, quiz totals, scores, and last activity. Reopen the dashboard and sign in again to load fresh results.

## Privacy

Quiz history is saved locally. Saving a name opts that browser into sharing progress with the admin, using a randomly generated browser identifier. Use nicknames for shared progress. Use separate browser profiles for students on a shared device. Clearing browser storage disconnects that device from its existing student record. The D1 records persist until the database owner removes them.

## Future work

- Admin-approved, source-referenced question bank
- Coach-managed team codes and private leaderboards
- Short-answer questions, title/author identification
- Accessible timer controls and keyboard shortcuts

Not affiliated with Oregon Battle of the Books.
"# bookbattle-obob" 
