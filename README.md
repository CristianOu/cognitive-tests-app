# Cognitive Tests App

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🧭 How to Link a Local Project with GitHub

Follow these steps to connect your local project to a new GitHub repository and push your code safely.

---

### 🪜 Step 1: Initialize Git Locally

```bash
git init
```

This command creates a new local Git repository inside your project folder.

---

### 🪜 Step 2: Add a `.gitignore` File

Make sure to exclude unnecessary or sensitive files (like dependencies or environment variables).

Example for a **Next.js** project:

```
node_modules/
.next/
.env
.env.local
dist/
.DS_Store
```

---

### 🪜 Step 3: Stage and Commit All Files

```bash
git add .
git commit -m "Initial commit"
```

This stages and commits all files to your local repository.

---

### 🪜 Step 4: Create a Remote Repository on GitHub

1. Go to [https://github.com/new](https://github.com/new)
2. Enter your **repository name** (e.g., `cognitive-platform`)
3. Set **visibility** to `Public`
4. **Do not** initialize with a README, license, or `.gitignore`
5. Click **Create Repository**

---

### 🪜 Step 5: Link the Local Repository to GitHub

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
```

---

### 🪜 Step 6: Pull Remote (If It Already Has Commits)

If the GitHub repo already has an initial commit (e.g., a README), merge histories:

```bash
git pull origin main --allow-unrelated-histories
```

---

### 🪜 Step 7: Push Local Code to GitHub

```bash
git branch -M main
git push -u origin main
```

This pushes your local code to the remote GitHub repository and sets the `main` branch as the default tracking branch.

---

### 🪜 Step 8: Verify Remote Connection

```bash
git remote -v
```

You should see output similar to:

```
origin  https://github.com/<your-username>/<repo-name>.git (fetch)
origin  https://github.com/<your-username>/<repo-name>.git (push)
```

---

### ✅ Done!

Your local project is now successfully connected to GitHub 🎉
Future workflow will look like this:

```bash
git add .
git commit -m "Describe your change"
git push
```

---

### 🧠 Common Issues and Fixes

| Issue                                                       | Fix                                                               |
| ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `fatal: refusing to merge unrelated histories`            | Use `git pull origin main --allow-unrelated-histories`          |
| `There is no tracking information for the current branch` | Run `git branch --set-upstream-to=origin/main main`             |
| Accidentally committed `.env`                             | Remove with `git rm --cached .env` and add it to `.gitignore` |

---

### 💡 Bonus: Check Commit History and Files

To view what’s been committed:

```bash
git log
```

To see which files changed in the latest commit:

```bash
git show --name-only
```

---

### 🔍 Quick Summary

| Command                                              | Purpose                      |
| ---------------------------------------------------- | ---------------------------- |
| `git init`                                         | Initialize local repo        |
| `git add .`                                        | Stage all files              |
| `git commit -m "message"`                          | Commit changes               |
| `git remote add origin <url>`                      | Link to GitHub repo          |
| `git pull origin main --allow-unrelated-histories` | Merge if remote isn’t empty |
| `git push -u origin main`                          | Push and set tracking        |
| `git status`                                       | Check current state          |
| `git log`                                          | View commit history          |

---

> 🧩 **Tip:** Always verify `.env` and build files are listed in `.gitignore` before committing.

## 🧱 Prisma Schema Updates

Whenever you make changes to your Prisma schema file (`prisma/schema.prisma`),
you need to regenerate the Prisma Client so your code reflects the latest database structure.

Run the following command:

```bash
npx prisma migrate dev (Created the migration and updated the database)
npx prisma generate (Generated TypeScript types)
```

> **Note:** On Windows, `npx prisma generate` may fail with an `EPERM` error if the Prisma query engine DLL is locked by a running process. If this happens:
>
> 1. Stop the dev server.
> 2. Restart your editor (e.g. VSCode) — its TypeScript server holds a lock on the DLL.
> 3. Run `npx prisma generate` again before starting the dev server.

## Environment Variables

When a new environment variable is introduced, it must be added in **all relevant places** to keep local development, deployments, and automation consistent.

### Required locations

1. **Local development**

   - Add the variable to the local `.env` file.
   - Example:
     ```env
     MY_NEW_VAR=value
     ```
2. **Vercel**

   - Add the same variable in **Vercel → Project Settings → Environment Variables**.
   - Ensure it is defined for the correct environments (Development, Preview, Production).
3. **GitHub Actions (if applicable)**

   - If the variable is used in any GitHub Action workflow:
     - Add it to **GitHub → Repository → Settings → Secrets and variables**.
     - Use **Secrets** for sensitive values (tokens, keys).
     - Use **Variables** for non-sensitive configuration.

### Notes

- Variable names must match **exactly** across all platforms.
- Missing variables may cause build failures, runtime errors, or broken CI pipelines.
- After updating environment variables, redeploy the project if required.
