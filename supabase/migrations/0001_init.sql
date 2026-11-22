-- Acellia REST API schema
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  email text unique not null,
  api_key_hash text unique,
  api_key_preview text,
  tier text not null default 'free' check (tier in ('free','partner','owner')),
  created_at timestamptz not null default now()
);

create table if not exists public.api_usage (
  user_id uuid not null references public.profiles(id) on delete cascade,
  usage_date date not null default (now() at time zone 'utc')::date,
  count int not null default 0,
  primary key (user_id, usage_date)
);

create table if not exists public.request_logs (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete set null,
  endpoint text not null,
  platform text,
  status_code int not null,
  created_at timestamptz not null default now()
);
create index if not exists request_logs_user_idx on public.request_logs(user_id, created_at desc);

-- Atomic quota consume. p_limit = -1 means unlimited.
create or replace function public.consume_quota(p_user_id uuid, p_limit int)
returns table(allowed boolean, used int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today date := (now() at time zone 'utc')::date;
  v_count int;
begin
  if p_limit < 0 then
    insert into api_usage(user_id, usage_date, count) values (p_user_id, v_today, 1)
    on conflict (user_id, usage_date) do update set count = api_usage.count + 1
    returning api_usage.count into v_count;
    return query select true, v_count;
    return;
  end if;

  insert into api_usage(user_id, usage_date, count) values (p_user_id, v_today, 1)
  on conflict (user_id, usage_date)
  do update set count = api_usage.count + 1
  where api_usage.count < p_limit
  returning api_usage.count into v_count;

  if v_count is null then
    select u.count into v_count from api_usage u where u.user_id = p_user_id and u.usage_date = v_today;
    return query select false, coalesce(v_count, p_limit);
  else
    return query select true, v_count;
  end if;
end;
$$;

revoke all on function public.consume_quota(uuid, int) from public, anon, authenticated;
grant execute on function public.consume_quota(uuid, int) to service_role;

alter table public.profiles enable row level security;
alter table public.api_usage enable row level security;
alter table public.request_logs enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "usage_select_own" on public.api_usage for select using (auth.uid() = user_id);
create policy "logs_select_own" on public.request_logs for select using (auth.uid() = user_id);
-- Insert/update dilakukan server-side dengan service role (bypass RLS).
