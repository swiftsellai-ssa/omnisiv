-- Listing kind: agent | mcp | skill. Default agent.
alter table agents add column if not exists kind text not null default 'agent';

alter table agents drop constraint if exists agents_kind_check;
alter table agents add constraint agents_kind_check
  check (kind in ('agent', 'mcp', 'skill'));

update agents set kind = 'mcp' where has_mcp = true and kind = 'agent';

create index if not exists agents_kind_idx on agents (kind);

insert into categories (name, slug, description) values
  ('Observability', 'observability', 'Agents for logs, tracing, monitoring, and incident response'),
  ('Payments', 'payments', 'Agents for billing, checkout, and payment operations')
on conflict (slug) do nothing;
