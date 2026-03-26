# AI Resume Builder - Deployment Guide

This project is built using Next.js (App Router), Prisma, NextAuth, and standard CSS. It is ready to be deployed to any Node.js hosting provider, with Vercel being the recommended choice for Next.js apps.

## Prerequisites
Before deploying, make sure you have:
1. A Vercel account (or similar provider like Render / Railway).
2. A PostgreSQL database (e.g., Supabase, Vercel Postgres, or Neon). We used SQLite for local development, but PostgreSQL is required for serverless deployment.
3. An OpenAI API Key.

## Step 1: Update Database Provider for Production
In `prisma/schema.prisma`, change the provider from `sqlite` to `postgresql`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 2: Set Environment Variables
In your hosting provider's dashboard (e.g., Vercel), set the following environment variables:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `NEXTAUTH_SECRET`: A secure random string (you can generate one using `openssl rand -base64 32`).
- `NEXTAUTH_URL`: The canonical URL of your deployed site (e.g., `https://my-resume-builder.vercel.app`).
- `OPENAI_API_KEY`: Your OpenAI API key.

## Step 3: Deploy to Vercel
1. Push this repository to GitHub.
2. Go to Vercel and create a new project from your GitHub repository.
3. Add the environment variables in the project settings.
4. Set the Build Command to: `npm run build`
5. Click **Deploy**.

*Note: Vercel automatically runs `prisma generate` during the build if you have the `postinstall` script setup, or you can add `"postinstall": "prisma generate"` to your `package.json`.*

## Troubleshooting
If you encounter `libuv` assertion errors or Prisma CLI crashes locally on Windows (e.g. `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`), this is a known Node.js Windows network issue with certain Prisma binaries. Try downgrading Prisma to `^5.0.0` or running via WSL.
