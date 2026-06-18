# Deploying the 35th IRC Operations Tracker — Step by Step

This turns the app into a real website with its own link that works for
everyone — on phones, tablets, and computers — with no Claude account
needed, and where everyone's changes are actually saved and shared.

You'll create two free accounts (Supabase for the database, GitHub +
Vercel for hosting) and copy/paste a few values between them. No coding
required. Budget about 20–30 minutes the first time.

---

## Part 1 — Create the database (Supabase)

1. Go to **supabase.com** and click **Start your project**. Sign up (free).
2. Click **New project**. Give it any name, e.g. `irc-ops-tracker`, choose
   any region close to you, and set a database password (save it somewhere,
   though you won't need it for this setup).
3. Wait about 1–2 minutes for the project to finish setting up.
4. In the left sidebar, click the **SQL Editor** icon.
5. Click **New query**, then open the file `supabase_schema.sql` from this
   project, copy its entire contents, and paste it into the SQL editor.
6. Click **Run**. You should see a success message. This created the table
   that will hold all your committee data.
7. In the left sidebar, go to **Database → Replication**. Find the table
   `irc_tracker_state` in the list and toggle it **on**. This makes live
   updates work (one person's changes show up for everyone else).
8. In the left sidebar, go to **Project Settings → API**. You'll see two
   values you need next:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (a long string under "Project API keys")

   Keep this browser tab open — you'll copy these into Vercel in Part 3.

---

## Part 2 — Put the code on GitHub

Vercel deploys directly from a GitHub repository, so the code needs a home there first.

1. Go to **github.com** and sign up if you don't have an account (free).
2. Click the **+** icon top right → **New repository**. Name it
   `irc-ops-tracker`, leave it **Public** or **Private** (either works),
   and click **Create repository**.
3. On the new repo's page, click **uploading an existing file**.
4. Drag in every file and folder from this project (everything inside the
   folder you downloaded from Claude, including the `src` folder, `package.json`,
   `vite.config.js`, `index.html`, `.gitignore`, `.env.example`, and
   `supabase_schema.sql`). Do **not** upload a `.env` file if you ever create one —
   it should stay off GitHub since it would contain your keys.
5. Scroll down and click **Commit changes**.

---

## Part 3 — Deploy to Vercel

1. Go to **vercel.com** and sign up using your GitHub account (free).
2. Click **Add New… → Project**.
3. Find your `irc-ops-tracker` repository in the list and click **Import**.
4. Vercel will auto-detect this as a Vite project — leave the build
   settings as-is.
5. Before clicking Deploy, expand **Environment Variables** and add two:
   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | the Project URL you copied from Supabase |
   | `VITE_SUPABASE_ANON_KEY` | the anon public key you copied from Supabase |
6. Click **Deploy**. Wait about a minute.
7. You'll get a real link like `irc-ops-tracker.vercel.app` — that's it!
   Share this link with every committee lead. It works on any device,
   no Claude account, no app to install — just a normal website.

---

## Making changes later

Any time you want to tweak the app (new tab, new field, anything), the
easiest path is: come back to Claude, ask for the change, get the updated
`App.jsx`, then on GitHub open `src/App.jsx` in your repo, click the pencil
(edit) icon, paste in the new version, and commit. Vercel automatically
redeploys within about a minute of any GitHub commit — no extra steps.

---

## About the AI Assistant tab

The "✨ AI Assistant" tab will tell users it isn't connected. Calling
Claude's API safely requires a small backend piece (so your API key isn't
exposed in the browser) — that's a separate addition, not something
Supabase or Vercel handle automatically. Everything else (status tracking,
budgets, signage, shipping, the Executive Summary export, etc.) works
fully without it. If you want that feature live, let Claude know and it
can add a Vercel serverless function for it.

## About security

This setup has no login system — anyone with the link can view and edit
the tracker, the same way a shared Google Sheet link works. That matches
how the original tool was being used (trusted committee leads with a
link), but it's worth knowing plainly: don't put anything in this tracker
you wouldn't want visible to anyone who has the URL. If you want a real
login system later, that's a bigger addition Claude can help plan.
