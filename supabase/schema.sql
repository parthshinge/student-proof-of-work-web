create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  username text not null unique,
  full_name text not null,
  profile_picture_url text,
  college text,
  branch text,
  year text,
  bio text,
  skills text[] not null default '{}',
  github text,
  linkedin text,
  website text,
  twitter text,
  wallet_address text,
  internship_status text,
  ppo_status text,
  stipend_status text,
  open_to_work boolean not null default true,
  resume_url text,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  tech_stack text[] not null default '{}',
  github_url text,
  demo_url text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proofs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  type text not null,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.proofs enable row level security;

create policy "Public profiles are readable" on public.profiles for select using (true);
create policy "Profile owners can insert their profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Profile owners can update their profile" on public.profiles for update using (auth.uid() = user_id);
create policy "Projects are publicly readable" on public.projects for select using (true);
create policy "Owners can manage projects" on public.projects for all using (
  exists (
    select 1 from public.profiles p where p.id = projects.profile_id and p.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.profiles p where p.id = projects.profile_id and p.user_id = auth.uid()
  )
);
create policy "Proofs are publicly readable" on public.proofs for select using (true);
create policy "Owners can manage proofs" on public.proofs for all using (
  exists (
    select 1 from public.profiles p where p.id = proofs.profile_id and p.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.profiles p where p.id = proofs.profile_id and p.user_id = auth.uid()
  )
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at before update on public.profiles for each row execute function public.touch_updated_at();
create trigger projects_touch_updated_at before update on public.projects for each row execute function public.touch_updated_at();
create trigger proofs_touch_updated_at before update on public.proofs for each row execute function public.touch_updated_at();