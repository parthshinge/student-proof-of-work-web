# Environment Guide

Set these variables in `.env.local` and in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anon key for browser and server session access
- `NEXT_PUBLIC_SITE_URL`: Canonical deployment URL, used for metadata, sitemap, and robots

Optional:

- `SUPABASE_SERVICE_ROLE_KEY`: Only needed if you later add server-side admin workflows or storage uploads

## Example

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```