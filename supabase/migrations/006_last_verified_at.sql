-- Trust signal: when an admin last verified this listing.
alter table agents add column if not exists last_verified_at timestamptz;
