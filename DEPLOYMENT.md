# Deployment Runbook — URL Shortener

Follow this top to bottom in order. Nothing is skipped — including the small setup steps that are easy to forget.

---

## Part 0 — Tools you need installed (one-time setup)

| Tool | Why you need it | Check if installed | Install |
|---|---|---|---|
| **Node.js** (v18+) | Runs the backend and builds the frontend | `node -v` | https://nodejs.org (LTS version) |
| **Git** | Version control, required to push to GitHub | `git --version` | https://git-scm.com/downloads |
| **A GitHub account** | Hosts your code; Render/Vercel deploy *from* GitHub | — | https://github.com/join |
| **A MongoDB Atlas account** | Free cloud database | — | https://www.mongodb.com/cloud/atlas/register |
| **A Render account** | Hosts the backend (Express server) | — | https://render.com |
| **A Vercel account** | Hosts the frontend (React build) | — | https://vercel.com |

### Recommended VS Code extensions (not required, but make this much easier)

Open VS Code → Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`) → search and install:

1. **ESLint** — catches JS errors as you type
2. **Prettier – Code formatter** — auto-formats on save
3. **ES7+ React/Redux/React-Native snippets** — faster component scaffolding
4. **MongoDB for VS Code** — browse your Atlas database without leaving the editor
5. **Thunder Client** — test your API endpoints (like Postman, built into VS Code) — useful for checking `POST /api/shorten` works before touching the frontend
6. **GitLens** — see git history/blame inline (optional, nice-to-have)

You do **not** need a "React extension" or "Node extension" beyond the above — Node.js itself (not a VS Code extension) is what actually runs your code.

---

## Part 1 — Unzip and set up the project locally

1. Download both zip files I gave you: `url-shortener-backend.zip` and `url-shortener-frontend.zip`.
2. Create one parent folder to hold both, e.g. on your Desktop:
   ```
   mkdir url-shortener
   ```
3. Unzip each into it, so you end up with:
   ```
   url-shortener/
   ├── backend/
   └── frontend/
   ```
   - **Windows:** right-click each zip → "Extract All" → choose the `url-shortener` folder.
   - **Mac:** double-click each zip (extracts next to itself), then drag the resulting `backend` and `frontend` folders into `url-shortener`.
   - **Terminal (any OS):**
     ```bash
     mkdir url-shortener && cd url-shortener
     unzip ~/Downloads/url-shortener-backend.zip
     unzip ~/Downloads/url-shortener-frontend.zip
     ```
4. Confirm the structure:
   ```bash
   cd url-shortener
   ls
   # should show: backend  frontend
   ```

---

## Part 2 — Get it running locally (do this before deploying anything)

Deploying broken code just gets you the same errors, slower. Always confirm it runs locally first.

### 2a. MongoDB Atlas — create your database

1. Go to https://cloud.mongodb.com and sign in.
2. Click **Create** (or "Build a Database") → choose the **free M0 tier** → pick any cloud provider/region → **Create Deployment**.
3. When prompted for a database user, set a **username and password** — write these down, you'll need them in the connection string. Click **Create Database User**.
4. Under **Network Access** (left sidebar) → **Add IP Address** → click **Allow Access from Anywhere** (`0.0.0.0/0`). This is necessary because Render's servers use dynamic IPs.
5. Go to **Database** (left sidebar) → click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   <your MongoDB Atlas connection string >
   ```
6. Replace `<username>` and `<password>` with the real values from step 3. Add a database name before the `?`, e.g. `.../urlshortener?retryWrites=true...`.

### 2b. Backend — install and run

```bash
cd url-shortener/backend
npm install
cp .env.example .env
```

Open `.env` in your editor and paste your real connection string:
```
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/urlshortener?retryWrites=true&w=majority
PORT=5000
```

Start it:
```bash
npm run dev
```
You should see:
```
MongoDB connected successfully
Server running on port 5000
```
If you see an error instead, jump to **Troubleshooting** at the bottom before continuing.

**Test it's actually working** — in a new terminal:
```bash
curl -X POST http://localhost:5000/api/shorten -H "Content-Type: application/json" -d "{\"url\":\"https://example.com\"}"
```
You should get back something like `{"shortCode":"aB3xY9"}`.

### 2c. Frontend — install and run

Open a **new terminal tab/window** (keep the backend running in the first one):
```bash
cd url-shortener/frontend
npm install
cp .env.example .env
npm run dev
```
It'll print a local URL, usually `http://localhost:5173`. Open that in your browser — you should see the full app, and pasting a URL should actually shorten it (talking to your local backend).

If both are running and the app works end-to-end locally, you're ready to deploy.

---

## Part 3 — Push the code to GitHub

### 3a. Create the repository on GitHub

1. Go to https://github.com/new
2. **Repository name:** `url-shortener` (or anything you like)
3. Keep it **Public** (Render/Vercel free tiers both work fine with public repos)
4. **Do not** check "Add a README" or "Add .gitignore" — you already have these locally, and it avoids a merge conflict on first push.
5. Click **Create repository**. GitHub will show you a page with commands — keep that page open, you'll copy the remote URL from it.

### 3b. Initialize git locally and push

From the **parent** `url-shortener` folder (the one containing both `backend/` and `frontend/`):

```bash
cd url-shortener
git init
git add .
git commit -m "Initial commit: URL shortener backend and frontend"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/url-shortener.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username (copy the exact URL from the page GitHub showed you in 3a — it's safer than typing it by hand).

**If `git push` asks for credentials and password auth fails:** GitHub no longer accepts your account password for git operations. Use a **Personal Access Token** instead:
1. GitHub → your profile photo → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**.
2. Check the `repo` scope → **Generate token** → copy it immediately (you won't see it again).
3. When `git push` prompts for a password, paste the token instead of your GitHub password.

### 3c. Verify

Refresh your GitHub repo page in the browser — you should see the `backend/` and `frontend/` folders there. If `node_modules` shows up too, your `.gitignore` files weren't picked up — double check they're inside `backend/` and `frontend/` respectively (each project already includes one).

---

## Part 4 — Deploy the backend to Render

1. Go to https://dashboard.render.com → **New +** → **Web Service**.
2. Connect your GitHub account if you haven't, then select your `url-shortener` repository.
3. Configure the service:
   | Field | Value |
   |---|---|
   | **Name** | `url-shortener-backend` (or anything) |
   | **Root Directory** | `backend` — **important**, since your repo has two projects in it |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | Free |
4. Scroll to **Environment Variables** → **Add Environment Variable**:
   - `MONGO_URI` → your real Atlas connection string
   - `PORT` → `5000` (Render sets its own `PORT` too, but this stays consistent with your `.env`)
5. Click **Create Web Service**. Render will build and deploy — watch the logs; you're looking for the same `MongoDB connected successfully` / `Server running on port ...` lines you saw locally.
6. Once live, Render gives you a public URL like:
   ```
   https://url-shortener-backend.onrender.com
   ```
   **Copy this URL** — you need it for the frontend next.

**Note on the free tier:** Render's free web services spin down after inactivity and take ~30–50 seconds to wake up on the next request. That's normal — not a bug in your code. Worth mentioning if a reviewer says "the first request was slow."

---

## Part 5 — Deploy the frontend to Vercel

1. Go to https://vercel.com/new
2. **Import** your `url-shortener` GitHub repository.
3. In the configuration screen:
   | Field | Value |
   |---|---|
   | **Framework Preset** | Vite (Vercel usually auto-detects this) |
   | **Root Directory** | `frontend` — click "Edit" next to Root Directory and set this, **important** for the same reason as Render |
   | **Build Command** | `npm run build` (default, should be pre-filled) |
   | **Output Directory** | `dist` (default for Vite, should be pre-filled) |
4. Expand **Environment Variables** and add:
   - `VITE_API_BASE_URL` → `https://url-shortener-backend.onrender.com` (your Render URL from Part 4, no trailing slash)
   - `VITE_SHORT_URL_BASE` → same value
5. Click **Deploy**. Vercel builds and gives you a live URL like:
   ```
   https://url-shortener-yourname.vercel.app
   ```

---

## Part 6 — Connect the two (CORS)

Right now your backend's `cors()` middleware allows all origins by default (fine for development, a bit loose for production). At minimum, verify it works — if you get a CORS error in the browser console when using the deployed frontend, tighten it like this:

**`backend/src/app.js`** — change:
```javascript
app.use(cors());
```
to:
```javascript
app.use(cors({
  origin: "https://url-shortener-yourname.vercel.app", // your real Vercel URL
}));
```
Commit and push this change — Render will auto-redeploy on every push to `main` (that's enabled by default).

```bash
git add backend/src/app.js
git commit -m "Restrict CORS to production frontend origin"
git push
```

---

## Part 7 — Test the live app end-to-end

1. Open your Vercel URL.
2. Paste a real long URL → **Shorten URL** → confirm a short link appears.
3. Click **Open** on it → confirm it redirects to the original site.
4. Refresh the page → confirm the link still shows in History (proves MongoDB persistence, not just local state).
5. Check **Statistics** updates the click count after step 3.

If all five work, you're fully deployed.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `MongoServerError: bad auth` | Wrong DB username/password in `MONGO_URI` | Double-check the credentials you set in Atlas step 2a.3 |
| `MongooseServerSelectionError` | Atlas Network Access doesn't allow the connecting IP | Re-check "Allow Access from Anywhere" (`0.0.0.0/0`) in Atlas |
| Frontend loads but shortening does nothing / console shows a CORS error | `VITE_API_BASE_URL` wrong, or CORS origin mismatch | Confirm the env var exactly matches your Render URL (no typo, no trailing slash); check Part 6 |
| Frontend loads but History never populates | `VITE_API_BASE_URL` still pointing at `localhost:5000` | You forgot to set it in Vercel's environment variables — set it and redeploy |
| Render build fails immediately | Root Directory not set to `backend` | Go to Render → your service → Settings → confirm Root Directory |
| Vercel build fails immediately | Root Directory not set to `frontend` | Go to Vercel → your project → Settings → General → confirm Root Directory |
| First request after inactivity takes ~30s | Render free tier cold start | Expected behavior, not a bug |
| `git push` rejected / asks for password and fails | GitHub requires a token, not your account password | Follow the Personal Access Token steps in Part 3b |

---

## Quick reference — all commands in order

```bash
# Local setup
cd url-shortener/backend && npm install && cp .env.example .env   # then edit .env
npm run dev

cd url-shortener/frontend && npm install && cp .env.example .env  # then edit .env
npm run dev

# Push to GitHub
cd url-shortener
git init
git add .
git commit -m "Initial commit: URL shortener backend and frontend"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/url-shortener.git
git push -u origin main

# Later updates
git add .
git commit -m "describe your change"
git push
```
