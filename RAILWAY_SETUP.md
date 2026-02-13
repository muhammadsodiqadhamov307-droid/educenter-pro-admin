# Deploying to Railway.app

For your project structure (Node.js Express Backend + React Frontend), **Railway is the highly recommended choice**.

**Why?**
- **No Code Changes:** Railway runs your application exactly like Docker does. Vercel would require refactoring your Express backend into Serverless functions.
- **Integrated Database:** Railway provides a managed PostgreSQL database with one click.
- **Simplicity:** It handles "build" and "start" commands automatically from your `package.json`.

---

## Step 1: Prepare Your Project

Your project is already configured correctly, but double-check your `package.json`:

```json
"scripts": {
  "build": "vite build && npx tsc server/index.ts --outDir dist-server --esModuleInterop",
  "start": "node dist-server/index.js"
}
```
*Railway will automatically run `Build Command` (npm run build) and then `Start Command` (npm start).*

## Step 2: Push to GitHub
Ensure all your latest changes (including `fix_deployment.sh` and version fixes) are pushed:

```bash
git add .
git commit -m "Ready for Railway"
git push origin main
```

## Step 3: Create Project on Railway

1.  Go to [Railway.app](https://railway.app/) and log in.
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select your repository: `educenter-pro-admin`.
4.  Click **"Deploy Now"**.

## Step 4: Add Database

1.  In your project view (canvas), right-click or click **"+ New"**.
2.  Select **Database** -> **Add PostgreSQL**.
3.  Railway will deploy a database container.

## Step 5: Configure Environment Variables

1.  Click on your application service (the one you deployed from GitHub).
2.  Go to the **"Variables"** tab.
3.  Add the following variables:

    | Variable Name | Value |
    | :--- | :--- |
    | `PORT` | `3000` |
    | `API_KEY` | *(Your Google Gemini API Key)* |
    | `DATABASE_URL` | *See below* |

    **Linking the Database:**
    - Instead of pasting a URL manually, type `${{PostgreSQL.DATABASE_URL}}` as the value for `DATABASE_URL`. Railway will auto-inject the connection string for the database you just created.

## Step 6: Verify and Generate Client

Railway might fail the first time because it needs to generate the Prisma client during the build *with* the database URL available (sometimes) or just needs a redeploy.

To ensure Prisma works:
1.  Go to **Settings** -> **Build**.
2.  Ensure build command is: `npm run build`.
3.  **(Optional but recommended)** Update your `package.json` build script to include generation:
    `"build": "npx prisma generate && vite build && npx tsc server/index.ts ..."`
    *(We already added `prisma generate` to the Dockerfile, but Railway uses package.json by default unless you tell it to use Dockerfile)*.

## Step 7: Domain Setup

1.  Go to **Settings** -> **Networking**.
2.  Click **"Generate Domain"** to get a free `xxx.up.railway.app` domain.
3.  (Optional) Click **"Custom Domain"** to connect `registrationadmin.duckdns.org`.

## Step 8: Initialize Database

Since you can't easily SSH into Railway to run commands like `prisma db push`, you can:
1.  **Add a deploy command:** In `package.json`, add `"postinstall": "prisma generate"`.
2.  **Use the Railway CLI** locally:
    ```bash
    npm i -g @railway/cli
    railway login
    railway link
    railway run npx prisma db push
    ```
    *OR*
3.  **Add it to your start script (Easiest for first run):**
    Change `package.json` "start" to:
    `"start": "npx prisma db push && node dist-server/index.js"`
    *(Remove `npx prisma db push` after the first successful deploy if you want faster startups)*.
