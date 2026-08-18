-- Anonymous search telemetry. No public access; service role inserts only.

create table if not exists search_logs (
  id            uuid primary key default gen_random_uuid(),
  query         text,
  filters       jsonb,
  result_count  integer,
  source        text,
  created_at    timestamptz default now()
);

create index if not exists search_logs_created_at_idx
  on search_logs (created_at desc);

create index if not exists search_logs_result_count_idx
  on search_logs (result_count);

create index if not exists search_logs_query_idx
  on search_logs (query);

alter table search_logs enable row level security;

revoke all on table search_logs from anon, authenticated, public;
grant all on table search_logs to service_role;
