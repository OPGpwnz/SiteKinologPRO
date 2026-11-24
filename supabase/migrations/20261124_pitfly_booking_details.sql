begin;

create function public.guard_pitfly_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      if new.role is distinct from 'client' then
        raise exception 'profile_role_forbidden';
      end if;
    elsif new.role is distinct from old.role then
      raise exception 'profile_role_forbidden';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.guard_pitfly_profile_role() from public, anon, authenticated;

create trigger pitfly_guard_profile_role
before insert or update of role on public.profiles
for each row execute function public.guard_pitfly_profile_role();

create table public.booking_details (
  booking_id uuid primary key references public.bookings(id) on delete cascade,
  dog_name text not null check (char_length(btrim(dog_name)) between 1 and 80),
  dog_breed text not null check (char_length(btrim(dog_breed)) between 1 and 100),
  dog_age text not null check (char_length(btrim(dog_age)) between 1 and 40),
  owner_name text not null check (char_length(btrim(owner_name)) between 1 and 100),
  contact_phone text not null check (
    char_length(contact_phone) <= 32
    and contact_phone ~ '^[+]?[0-9 ().-]+$'
    and char_length(regexp_replace(contact_phone, '[^0-9]', '', 'g')) between 7 and 15
  )
);

alter table public.booking_details enable row level security;
revoke all on public.booking_details from public, anon, authenticated;
grant select on public.booking_details to authenticated;

create policy "Booking details are visible to the client and trainers"
on public.booking_details for select to authenticated
using (
  exists (
    select 1 from public.bookings b
    where b.id = booking_id and b.client_id = (select auth.uid())
  ) or exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'trainer'
  )
);

create function public.write_pitfly_booking_details(p_booking_id uuid, p_details jsonb)
returns public.booking_details
language sql
set search_path = ''
as $$
  insert into public.booking_details (booking_id, dog_name, dog_breed, dog_age, owner_name, contact_phone)
  values (
    p_booking_id, btrim(p_details->>'dog_name'), btrim(p_details->>'dog_breed'),
    btrim(p_details->>'dog_age'), btrim(p_details->>'owner_name'), btrim(p_details->>'contact_phone')
  )
  on conflict (booking_id) do update set
    dog_name = excluded.dog_name,
    dog_breed = excluded.dog_breed,
    dog_age = excluded.dog_age,
    owner_name = excluded.owner_name,
    contact_phone = excluded.contact_phone
  returning *;
$$;

revoke all on function public.write_pitfly_booking_details(uuid, jsonb) from public, anon, authenticated;

create function public.create_pitfly_booking_with_details(
  p_slot_id uuid, p_service_code text, p_use_subscription boolean, p_details jsonb
)
returns public.bookings
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_booking public.bookings;
begin
  -- Booking, subscription use and contact details succeed or roll back together.
  select * into v_booking
  from public.create_pitfly_booking(p_slot_id, p_service_code, p_use_subscription);
  perform public.write_pitfly_booking_details(v_booking.id, p_details);
  return v_booking;
end;
$$;

revoke all on function public.create_pitfly_booking_with_details(uuid, text, boolean, jsonb) from public, anon, authenticated;
grant execute on function public.create_pitfly_booking_with_details(uuid, text, boolean, jsonb) to authenticated;
revoke all on function public.create_pitfly_booking(uuid, text, boolean) from public, anon, authenticated;

create function public.update_pitfly_booking_details(p_booking_id uuid, p_details jsonb)
returns public.booking_details
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'trainer'
  ) then
    raise exception 'not_trainer';
  end if;

  perform 1 from public.bookings b where b.id = p_booking_id for update;
  if not found then
    raise exception 'booking_not_found';
  end if;

  return public.write_pitfly_booking_details(p_booking_id, p_details);
end;
$$;

revoke all on function public.update_pitfly_booking_details(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.update_pitfly_booking_details(uuid, jsonb) to authenticated;

commit;
