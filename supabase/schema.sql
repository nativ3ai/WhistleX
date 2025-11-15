-- Intel Marketplace Supabase schema

create extension if not exists "pgcrypto";

create table if not exists intel_pool (
  id uuid primary key default gen_random_uuid(),
  chain_id integer not null,
  factory_address text not null,
  pool_address text not null unique,
  creator_wallet text not null,
  title text not null,
  description text,
  token_address text not null,
  price_threshold numeric(30,6) not null,
  price_threshold_raw numeric(40,0) not null,
  deadline_ts timestamptz not null,
  uri text not null,
  content_hash text not null,
  status text not null default 'live',
  created_at timestamptz not null default now()
);

create table if not exists contribution (
  id bigserial primary key,
  pool_address text not null references intel_pool(pool_address),
  contributor_wallet text not null,
  amount_raw numeric(40,0) not null,
  amount_usdc numeric(30,6) generated always as (amount_raw / 1e6) stored,
  tx_hash text not null,
  block_number bigint,
  block_ts timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists pool_unlock (
  id bigserial primary key,
  pool_address text not null references intel_pool(pool_address),
  tx_hash text not null,
  block_number bigint,
  block_ts timestamptz,
  total_raised_raw numeric(40,0),
  created_at timestamptz not null default now()
);

create table if not exists withdrawal (
  id bigserial primary key,
  pool_address text not null references intel_pool(pool_address),
  to_wallet text not null,
  amount_raw numeric(40,0) not null,
  amount_usdc numeric(30,6) generated always as (amount_raw / 1e6) stored,
  tx_hash text not null,
  block_number bigint,
  block_ts timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists refund (
  id bigserial primary key,
  pool_address text not null references intel_pool(pool_address),
  to_wallet text not null,
  amount_raw numeric(40,0) not null,
  amount_usdc numeric(30,6) generated always as (amount_raw / 1e6) stored,
  tx_hash text not null,
  block_number bigint,
  block_ts timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists intel_blob (
  id uuid primary key default gen_random_uuid(),
  pool_address text not null,
  encrypted_data jsonb not null,
  content_hash text not null,
  created_at timestamptz not null default now()
);

drop function if exists intel_list_pools cascade;
create function intel_list_pools()
returns table (
  pool_address text,
  creator_wallet text,
  title text,
  description text,
  token_address text,
  price_threshold numeric(30,6),
  price_threshold_raw numeric(40,0),
  total_raised numeric(30,6),
  total_raised_raw numeric(40,0),
  deadline_ts timestamptz,
  status text,
  uri text
) language sql as $$
  select
    p.pool_address,
    p.creator_wallet,
    p.title,
    p.description,
    p.token_address,
    p.price_threshold,
    p.price_threshold_raw,
    coalesce(sum(c.amount_usdc), 0) as total_raised,
    coalesce(sum(c.amount_raw), 0) as total_raised_raw,
    p.deadline_ts,
    p.status,
    p.uri
  from intel_pool p
  left join contribution c on c.pool_address = p.pool_address
  group by p.pool_address
  order by p.created_at desc;
$$;

drop function if exists intel_get_pool cascade;
create function intel_get_pool(pool_address text)
returns table (
  pool_address text,
  creator_wallet text,
  title text,
  description text,
  token_address text,
  price_threshold numeric(30,6),
  price_threshold_raw numeric(40,0),
  total_raised numeric(30,6),
  total_raised_raw numeric(40,0),
  deadline_ts timestamptz,
  status text,
  uri text,
  contributions jsonb,
  unlock_tx_hash text,
  withdraw_tx_hash text
) language sql as $$
  select
    p.pool_address,
    p.creator_wallet,
    p.title,
    p.description,
    p.token_address,
    p.price_threshold,
    p.price_threshold_raw,
    coalesce(sum(c.amount_usdc), 0),
    coalesce(sum(c.amount_raw), 0),
    p.deadline_ts,
    p.status,
    p.uri,
    coalesce(jsonb_agg(jsonb_build_object(
      'contributor_wallet', c.contributor_wallet,
      'amount_raw', c.amount_raw,
      'amount_usdc', c.amount_usdc,
      'tx_hash', c.tx_hash,
      'block_number', c.block_number,
      'block_ts', c.block_ts
    ) order by c.created_at desc) filter (where c.id is not null), '[]'::jsonb),
    (select w.tx_hash from pool_unlock w where w.pool_address = p.pool_address order by w.created_at desc limit 1),
    (select wd.tx_hash from withdrawal wd where wd.pool_address = p.pool_address order by wd.created_at desc limit 1)
  from intel_pool p
  left join contribution c on c.pool_address = p.pool_address
  where lower(p.pool_address) = lower(pool_address)
  group by p.pool_address;
$$;
