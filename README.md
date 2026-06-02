# Student Proof-of-Work

A production-ready Next.js 15 application for students to publish a public proof-of-work profile with projects, proofs, wallet connection, and recruiter-friendly SEO.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Supabase Auth + Postgres
- ethers.js wallet connect
- Vercel deployment ready

## Features

- Modern landing page with hero, features, process, CTA, navbar, and footer
- Email/password authentication through Supabase Auth
- Protected dashboard for profile, skills, projects, proofs, resume, and social links
- Public profile pages at `/profile/[username]`
- Profile completion score, view counter, share URL, and copy wallet button
- Sitemap, robots.txt, metadata, and Open Graph support
- Dark/light mode and responsive glassmorphism UI

## Quick Start

1. Create a Supabase project and run the SQL in [`supabase/schema.sql`](supabase/schema.sql).
2. Copy `.env.example` to `.env.local` and fill in your Supabase values.
3. Install dependencies and run the app:

```bash
npm install
npm run dev
```

## Environment Variables

See [`docs/environment.md`](docs/environment.md).

## Deployment

See [`docs/deployment.md`](docs/deployment.md).

## Supabase Setup

- Create a new Supabase project.
- Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
- Enable email authentication in Supabase Auth.
- Add the environment variables to Vercel and your local `.env.local`.

## Local Routes

- `/` landing page
- `/auth` sign up / log in
- `/dashboard` protected dashboard
- `/profile/demo-student` demo public profile

## Notes

- The dashboard stores proof screenshots and project images as URL fields by default. You can wire these to Supabase Storage buckets if you want direct file uploads.
- Wallet connection is read-only and does not perform transactions.This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
