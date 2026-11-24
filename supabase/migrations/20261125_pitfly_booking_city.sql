begin;

alter table public.booking_details
add column city text check (char_length(btrim(city)) between 1 and 100);

create or replace function public.write_pitfly_booking_details(p_booking_id uuid, p_details jsonb)
returns public.booking_details
language sql
set search_path = ''
as $$
  insert into public.booking_details (booking_id, dog_name, dog_breed, dog_age, owner_name, contact_phone, city)
  values (
    p_booking_id, btrim(p_details->>'dog_name'), btrim(p_details->>'dog_breed'),
    btrim(p_details->>'dog_age'), btrim(p_details->>'owner_name'), btrim(p_details->>'contact_phone'),
    nullif(btrim(p_details->>'city'), '')
  )
  on conflict (booking_id) do update set
    dog_name = excluded.dog_name,
    dog_breed = excluded.dog_breed,
    dog_age = excluded.dog_age,
    owner_name = excluded.owner_name,
    contact_phone = excluded.contact_phone,
    city = case when p_details ? 'city' then excluded.city else booking_details.city end
  returning *;
$$;

notify pgrst, 'reload schema';

commit;
