-- Admin reads/writes: explicit grants for service_role (belt-and-suspenders).

grant select, insert, update on submissions to service_role;
grant select, insert, update on agents to service_role;
grant insert on search_logs to service_role;
