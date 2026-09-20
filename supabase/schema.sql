-- 不動産管理アプリ用のテーブル定義
-- Supabase ダッシュボードの SQL Editor に貼り付けて実行する。
-- 同じ内容を何度実行しても壊れないように書いてある。

-- ============================================================
-- 1. 物件テーブル
-- ============================================================
create table if not exists public.properties (
  id          uuid        primary key default gen_random_uuid(),
  -- 登録したユーザー。既定値を auth.uid() にしているので、
  -- アプリ側から user_id を送らなくてもログイン中のユーザーが入る。
  -- ユーザーが削除されたら、その人の物件もまとめて消える。
  user_id     uuid        not null default auth.uid()
                          references auth.users (id) on delete cascade,
  name        text        not null check (length(btrim(name)) > 0),   -- 物件名
  rent        integer     not null check (rent >= 0),                 -- 家賃（円）
  area        text        not null check (length(btrim(area)) > 0),   -- エリア名
  layout      text        not null check (length(btrim(layout)) > 0), -- 間取り（例: 1LDK）
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 一覧は「自分の物件を新しい順」で取るので、その並びに合わせた索引を張る
create index if not exists properties_user_id_created_at_idx
  on public.properties (user_id, created_at desc);

-- ============================================================
-- 2. updated_at の自動更新
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ============================================================
-- 3. RLS（行レベルセキュリティ）
-- ============================================================
-- これを有効にすると、ポリシーで許可した行以外は読み書きできなくなる。
-- 有効にしただけでポリシーが無い状態は「全部拒否」になる。
alter table public.properties enable row level security;

-- 作り直せるように、同名のポリシーがあれば先に消す
drop policy if exists "自分の物件だけ参照できる" on public.properties;
drop policy if exists "自分の物件として登録できる" on public.properties;
drop policy if exists "自分の物件だけ更新できる" on public.properties;
drop policy if exists "自分の物件だけ削除できる" on public.properties;

-- SELECT: 自分が登録した行だけ見える
create policy "自分の物件だけ参照できる"
  on public.properties for select
  to authenticated
  using (auth.uid() = user_id);

-- INSERT: 他人の user_id を指定した登録を防ぐ
create policy "自分の物件として登録できる"
  on public.properties for insert
  to authenticated
  with check (auth.uid() = user_id);

-- UPDATE: using = 更新できる行の条件、with check = 更新後の行が満たすべき条件。
-- 両方書かないと、他人へ user_id を付け替えられてしまう。
create policy "自分の物件だけ更新できる"
  on public.properties for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE: 自分が登録した行だけ削除できる
create policy "自分の物件だけ削除できる"
  on public.properties for delete
  to authenticated
  using (auth.uid() = user_id);
