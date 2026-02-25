create table if not exists relationship_state (
  id int primary key default 1 check (id = 1),
  status text not null check (status in ('PENDING', 'YES', 'NO')),
  met_at_utc timestamptz not null,
  decided_at_utc timestamptz,
  anniversary_start_utc timestamptz,
  updated_at_utc timestamptz not null default now()
);

create table if not exists event_log (
  id bigint generated always as identity primary key,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at_utc timestamptz not null default now()
);

insert into relationship_state (id, status, met_at_utc, decided_at_utc, anniversary_start_utc, updated_at_utc)
values (1, 'PENDING', now(), null, null, now())
on conflict (id) do nothing;
