-- Ensure profiles has avatar_url for display pictures
alter table public.profiles add column if not exists avatar_url text;

-- Create enrollments table
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

alter table public.enrollments enable row level security;

-- Drop and recreate RLS policies for enrollments to avoid duplicates
drop policy if exists "Users can view their enrollments" on public.enrollments;
create policy "Users can view their enrollments" on public.enrollments
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can enroll themselves" on public.enrollments;
create policy "Users can enroll themselves" on public.enrollments
for insert to authenticated with check (auth.uid() = user_id);

-- Badges tables
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

alter table public.user_badges enable row level security;

drop policy if exists "Users can view own badges" on public.user_badges;
create policy "Users can view own badges" on public.user_badges
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can earn badges for themselves" on public.user_badges;
create policy "Users can earn badges for themselves" on public.user_badges
for insert to authenticated with check (auth.uid() = user_id);

-- Seed badge
insert into public.badges (slug, name, description, icon)
values ('first_enrollment', 'Getting Started', 'Enrolled in your first course', '🎉')
on conflict (slug) do nothing;

-- Storage bucket and policies for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );