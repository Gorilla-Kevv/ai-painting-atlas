-- =====================================================================
-- AI 生图知识图谱 · 社区共建功能 Supabase 初始化脚本
-- 执行位置：Supabase Dashboard → SQL Editor → 粘贴全部 → Run
--
-- ⚠ 执行顺序（两种均可）：
--   A. 先执行本文件 → 再去注册账号（触发器自动建 profile）→ 最后执行
--      文件末尾第 5 节 bootstrap 语句把自己标为管理员
--   B. 已先注册账号 → 执行本文件 → 需手工补一行 profile：
--      insert into public.profiles (id, email, display_name)
--      select id, email, split_part(email, '@', 1) from auth.users
--      on conflict (id) do nothing;
--      → 再执行第 5 节 bootstrap
--
-- ⚠ Dashboard → Authentication → URL Configuration：
--   Site URL        = https://gorilla-kevv.github.io/ai-painting-atlas
--   Redirect URLs  += https://gorilla-kevv.github.io/ai-painting-atlas/*
--                     http://localhost:8000/*
--
-- ⚠ 免费层注意：项目 7 天无活动会被暂停（暂停后登录/投稿不可用，
--   站点浏览与仓库内容完全不受影响）。定期登录 Dashboard 即可保活。
-- =====================================================================

-- ============ 1. profiles（用户资料，is_admin 为管理员标记） ============
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  is_admin     boolean not null default false,
  created_at   timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
-- 故意不建 insert policy：只能由下方 security definer 触发器写入

-- ============ 2. 管理员判定函数（security definer 防策略递归） ============
create or replace function public.is_admin()
returns boolean
language sql security definer stable
set search_path = public as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

-- ============ 3. submissions（投稿暂存队列，仓库为唯一事实源） ============
create table if not exists public.submissions (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  user_email    text not null,
  type          text not null check (type in ('section_block','glossary','resource','tutorial','block_edit')),
  target_sec_id text,
  payload       jsonb not null,
  status        text not null default 'pending'
                check (status in ('pending','approved','rejected','synced','removed')),
  admin_note    text,
  reviewed_at   timestamptz,
  synced_at     timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists submissions_status_idx on public.submissions (status, created_at);
create index if not exists submissions_user_idx   on public.submissions (user_id);

alter table public.submissions enable row level security;

-- 匿名（anon key）：未建任何 policy → 默认全拒绝

drop policy if exists "submissions_insert_own" on public.submissions;
create policy "submissions_insert_own" on public.submissions
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "submissions_select_own_or_admin" on public.submissions;
create policy "submissions_select_own_or_admin" on public.submissions
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "submissions_update_admin" on public.submissions;
create policy "submissions_update_admin" on public.submissions
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "submissions_delete_own_pending" on public.submissions;
create policy "submissions_delete_own_pending" on public.submissions
  for delete using (auth.uid() = user_id and status = 'pending');

drop policy if exists "submissions_delete_admin" on public.submissions;
create policy "submissions_delete_admin" on public.submissions
  for delete using (public.is_admin());

-- ============ 4. 注册触发器：自动建 profile ============
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ 5. 管理员 Bootstrap（先注册自己，再执行并把邮箱换成你的） ============
-- update public.profiles set is_admin = true where email = '你的邮箱@example.com';

-- ============ 6. 迁移：追加 block_edit 类型（已按旧版建过表的用户执行这一段） ============
alter table public.submissions drop constraint if exists submissions_type_check;
alter table public.submissions add constraint submissions_type_check
  check (type in ('section_block','glossary','resource','tutorial','block_edit'));
