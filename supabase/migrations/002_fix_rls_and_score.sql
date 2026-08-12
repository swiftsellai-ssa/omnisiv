-- Fix RLS for junction tables (required for embedded joins)
alter table agent_categories enable row level security;
alter table agent_tags enable row level security;

drop policy if exists "Public read agent_categories" on agent_categories;
create policy "Public read agent_categories" on agent_categories
  for select using (true);

drop policy if exists "Public read agent_tags" on agent_tags;
create policy "Public read agent_tags" on agent_tags
  for select using (true);

-- Ensure score column fits 100
alter table agents alter column agent_ready_score type numeric(5,2);

-- Table-level grants for Supabase API roles
grant usage on schema public to anon, authenticated;

grant select on agents, categories, tags, agent_categories, agent_tags, reviews
  to anon, authenticated;

grant insert on submissions to anon, authenticated;
