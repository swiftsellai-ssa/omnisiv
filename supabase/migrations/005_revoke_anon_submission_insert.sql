-- Run in the Supabase SQL editor AFTER /api/submit inserts with the service role.
-- Direct PostgREST inserts from the public anon/authenticated keys must stop.

revoke insert on submissions from anon, authenticated;
