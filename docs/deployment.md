# Deployment Guide

## Vercel

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add the environment variables from [`docs/environment.md`](docs/environment.md).
4. Deploy with the default Next.js build settings.

## Supabase

1. Create a new Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql).
3. Enable email/password authentication.
4. Confirm the redirect URL points to your deployed domain for the auth flow.

## Production Checklist

- Ensure `NEXT_PUBLIC_SITE_URL` points to the canonical domain.
- Verify public profile routes work without auth.
- Test sign up, login, logout, profile save, and project/proof mutations.
- Confirm any storage buckets you add are public or signed as needed.