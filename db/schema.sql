begin;

create table if not exists relationship_state (
  id int primary key default 1 check (id = 1),
  status text not null check (status in ('PENDING', 'YES', 'NO')),
  met_at_utc timestamptz not null,
  decided_at_utc timestamptz,
  anniversary_start_utc timestamptz,
  updated_at_utc timestamptz not null default now(),
  constraint relationship_state_status_consistency check (
    (status = 'PENDING' and decided_at_utc is null and anniversary_start_utc is null) or
    (status = 'YES' and decided_at_utc is not null and anniversary_start_utc is not null) or
    (status = 'NO' and decided_at_utc is not null and anniversary_start_utc is null)
  )
);

create table if not exists event_log (
  id bigint generated always as identity primary key,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at_utc timestamptz not null default now()
);

create index if not exists event_log_event_type_created_idx
  on event_log (event_type, created_at_utc desc);

create or replace function set_relationship_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at_utc = now();
  return new;
end;
$$;

drop trigger if exists trg_relationship_state_updated_at on relationship_state;
create trigger trg_relationship_state_updated_at
before update on relationship_state
for each row
execute function set_relationship_state_updated_at();

insert into relationship_state (id, status, met_at_utc, decided_at_utc, anniversary_start_utc)
values (1, 'PENDING', now(), null, null)
on conflict (id) do nothing;

commit;
