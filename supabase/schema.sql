create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.wedding_sites (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  bride_name text not null,
  groom_name text not null,
  wedding_date timestamptz,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.album_images (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.wedding_sites(id) on delete cascade,
  title text,
  description text,
  image_url text not null,
  storage_path text,
  width int,
  height int,
  sort_order int default 0,
  is_visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.guest_comments (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.wedding_sites(id) on delete cascade,
  name text not null,
  message text not null,
  attendance_status text check (attendance_status in ('attending', 'not_attending', 'maybe')),
  guest_count int check (guest_count is null or (guest_count between 1 and 20)),
  is_visible boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.site_settings (
  site_id uuid primary key references public.wedding_sites(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists album_images_site_id_idx on public.album_images(site_id);
create index if not exists album_images_is_visible_idx on public.album_images(is_visible);
create index if not exists album_images_sort_order_idx on public.album_images(sort_order);
create index if not exists guest_comments_site_id_idx on public.guest_comments(site_id);
create index if not exists guest_comments_is_visible_idx on public.guest_comments(is_visible);
create index if not exists guest_comments_created_at_idx on public.guest_comments(created_at);

drop trigger if exists set_wedding_sites_updated_at on public.wedding_sites;
create trigger set_wedding_sites_updated_at
before update on public.wedding_sites
for each row execute function public.set_updated_at();

drop trigger if exists set_album_images_updated_at on public.album_images;
create trigger set_album_images_updated_at
before update on public.album_images
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.wedding_sites enable row level security;
alter table public.album_images enable row level security;
alter table public.guest_comments enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can read active wedding sites" on public.wedding_sites;
create policy "Public can read active wedding sites"
on public.wedding_sites
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read visible album images" on public.album_images;
create policy "Public can read visible album images"
on public.album_images
for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "Public can read visible guest comments" on public.guest_comments;
create policy "Public can read visible guest comments"
on public.guest_comments
for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.wedding_sites
    where wedding_sites.id = site_settings.site_id
      and wedding_sites.is_active = true
  )
);

drop policy if exists "Public can create guest comments" on public.guest_comments;
create policy "Public can create guest comments"
on public.guest_comments
for insert
to anon, authenticated
with check (is_visible = true);

insert into storage.buckets (id, name, public)
values ('wedding-images', 'wedding-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read wedding image objects" on storage.objects;
create policy "Public can read wedding image objects"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'wedding-images');
