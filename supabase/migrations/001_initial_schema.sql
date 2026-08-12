-- Omnisiv initial schema
-- Run in Supabase SQL Editor or via supabase db push

create extension if not exists vector;
create extension if not exists pg_trgm;

-- Agents
create table if not exists agents (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  slug                  text unique not null,
  short_description     text not null,
  description           text,
  website_url           text,
  github_url            text,
  demo_url              text,
  docs_url              text,
  mcp_url               text,
  pricing_type          text check (pricing_type in ('free', 'freemium', 'paid', 'open_source', 'enterprise')),
  pricing_details       text,
  is_open_source        boolean default false,
  is_self_hostable      boolean default false,
  has_api               boolean default false,
  has_mcp               boolean default false,
  is_structured         boolean default false,
  payment_ready         boolean default false,
  rating                numeric(3,2) default 0,
  review_count          integer default 0,
  view_count            integer default 0,
  agent_ready_score     numeric(5,2) default 0,
  status                text default 'published'
                        check (status in ('draft', 'published', 'archived', 'pending')),
  embedding             vector(1536),
  source                text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now(),
  published_at          timestamptz
);

-- Categories
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  created_at  timestamptz default now()
);

create table if not exists agent_categories (
  agent_id    uuid references agents(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (agent_id, category_id)
);

-- Tags
create table if not exists tags (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists agent_tags (
  agent_id uuid references agents(id) on delete cascade,
  tag_id   uuid references tags(id) on delete cascade,
  primary key (agent_id, tag_id)
);

-- Submissions
create table if not exists submissions (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  website_url       text,
  short_description text,
  submitted_by      text,
  status            text default 'pending'
                    check (status in ('pending', 'approved', 'rejected')),
  notes             text,
  created_at        timestamptz default now()
);

-- Reviews (future)
create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  agent_id    uuid references agents(id) on delete cascade,
  rating      integer check (rating between 1 and 5),
  comment     text,
  author_name text,
  created_at  timestamptz default now()
);

-- Indexes
create index if not exists agents_slug_idx on agents (slug);
create index if not exists agents_status_idx on agents (status);
create index if not exists agents_has_mcp_idx on agents (has_mcp);
create index if not exists agents_has_api_idx on agents (has_api);
create index if not exists agents_agent_ready_score_idx on agents (agent_ready_score desc);
create index if not exists agents_name_trgm_idx on agents using gin (name gin_trgm_ops);
create index if not exists agents_short_desc_trgm_idx on agents using gin (short_description gin_trgm_ops);

-- Full-text search
alter table agents add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(short_description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;

create index if not exists agents_search_idx on agents using gin (search_vector);

-- Auto-update agent_ready_score
create or replace function update_agent_ready_score()
returns trigger as $$
begin
  new.agent_ready_score := least(
  (case when new.has_mcp then 40 else 0 end) +
  (case when new.has_api then 18 else 0 end) +
  (case when new.is_structured then 12 else 0 end) +
  (case when new.is_open_source then 8 else 0 end) +
  (case when new.is_self_hostable then 8 else 0 end) +
  (case when new.payment_ready then 7 else 0 end) +
  (case when new.docs_url is not null and new.docs_url != '' then 5 else 0 end) +
  (case when new.rating >= 4.2 then 2 else 0 end),
  100);
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists agents_score_trigger on agents;
create trigger agents_score_trigger
  before insert or update on agents
  for each row execute function update_agent_ready_score();

-- RLS
alter table agents enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table submissions enable row level security;
alter table reviews enable row level security;

drop policy if exists "Public read published agents" on agents;
create policy "Public read published agents" on agents
  for select using (status = 'published');

drop policy if exists "Public read categories" on categories;
create policy "Public read categories" on categories for select using (true);

drop policy if exists "Public read tags" on tags;
create policy "Public read tags" on tags for select using (true);

drop policy if exists "Anyone can submit" on submissions;
create policy "Anyone can submit" on submissions
  for insert with check (true);

drop policy if exists "Public read reviews" on reviews;
create policy "Public read reviews" on reviews for select using (true);

-- Junction tables (required for category/tag joins via PostgREST)
alter table agent_categories enable row level security;
alter table agent_tags enable row level security;

drop policy if exists "Public read agent_categories" on agent_categories;
create policy "Public read agent_categories" on agent_categories
  for select using (true);

drop policy if exists "Public read agent_tags" on agent_tags;
create policy "Public read agent_tags" on agent_tags
  for select using (true);

-- Table-level grants (required for Supabase anon/authenticated roles)
grant usage on schema public to anon, authenticated;

grant select on agents, categories, tags, agent_categories, agent_tags, reviews
  to anon, authenticated;

grant insert on submissions to anon, authenticated;
