create or replace function public.get_available_pitfly_slots_v2()
returns table (
  id uuid,
  starts_at timestamptz,
  ends_at timestamptz,
  capacity smallint,
  is_open boolean,
  available_places integer,
  has_open_pair boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.starts_at,
    s.ends_at,
    s.capacity,
    s.is_open,
    (coalesce(s.capacity, 1) - count(b.id))::integer as available_places,
    exists (
      select 1
      from public.bookings pair_booking
      join public.services pair_service on pair_service.code = pair_booking.service_code
      where pair_booking.slot_id = s.id
        and pair_booking.status = 'active'
        and pair_booking.pair_group_id is not null
        and pair_service.requires_pair = true
      group by pair_booking.pair_group_id
      having count(*) < 2
    ) as has_open_pair
  from public.slots s
  left join public.bookings b
    on b.slot_id = s.id
   and b.status = 'active'
  where s.is_open = true
    and s.starts_at > now()
  group by s.id
  having count(b.id) < coalesce(s.capacity, 1)
  order by s.starts_at;
$$;

revoke all on function public.get_available_pitfly_slots_v2() from public;
grant execute on function public.get_available_pitfly_slots_v2() to anon, authenticated;

create or replace function public.create_pitfly_booking(
  p_slot_id uuid,
  p_service_code text,
  p_use_subscription boolean default false
)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_slot public.slots%rowtype;
  v_service public.services%rowtype;
  v_active_count integer;
  v_existing_pair_group uuid;
  v_subscription public.subscriptions%rowtype;
  v_group_id uuid;
  v_booking public.bookings%rowtype;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  select * into v_slot
  from public.slots
  where id = p_slot_id and is_open = true and starts_at > now()
  for update;

  if not found then
    raise exception 'slot_unavailable';
  end if;

  select * into v_service
  from public.services
  where code = p_service_code;

  if not found then
    raise exception 'service_not_found';
  end if;

  if v_service.requires_pair and coalesce(v_slot.capacity, 1) < 2 then
    raise exception 'slot_capacity_mismatch';
  elsif not v_service.requires_pair and coalesce(v_slot.capacity, 1) < 1 then
    raise exception 'slot_capacity_mismatch';
  end if;

  if extract(epoch from (v_slot.ends_at - v_slot.starts_at)) / 60 < v_service.duration_min then
    raise exception 'slot_duration_mismatch';
  end if;

  if p_use_subscription and v_service.is_subscription then
    raise exception 'subscription_not_applicable';
  end if;

  select count(*) into v_active_count
  from public.bookings
  where slot_id = p_slot_id and status = 'active';

  if v_active_count >= coalesce(v_slot.capacity, 1) then
    raise exception 'slot_full';
  end if;

  if v_service.requires_pair then
    select b.pair_group_id into v_existing_pair_group
    from public.bookings b
    join public.services existing_service on existing_service.code = b.service_code
    where b.slot_id = p_slot_id
      and b.status = 'active'
      and b.pair_group_id is not null
      and existing_service.requires_pair = true
    group by b.pair_group_id
    having count(*) < 2
    order by min(b.created_at)
    limit 1;

    if found then
      v_group_id := v_existing_pair_group;
    elsif coalesce(v_slot.capacity, 1) - v_active_count >= 2 then
      v_group_id := gen_random_uuid();
    else
      raise exception 'slot_full';
    end if;
  else
    v_group_id := null;
  end if;

  if p_use_subscription then
    select * into v_subscription
    from public.subscriptions
    where client_id = v_user
      and status = 'active'
      and expires_at > now()
      and used_lessons < total_lessons
    order by expires_at
    limit 1
    for update;

    if not found then
      raise exception 'subscription_unavailable';
    end if;
  end if;

  insert into public.bookings (
    slot_id, client_id, service_code, pair_group_id, status,
    payment_status, subscription_id
  )
  values (
    p_slot_id, v_user, p_service_code, v_group_id, 'active',
    case when p_use_subscription then 'paid' else 'unpaid' end,
    v_subscription.id
  )
  returning * into v_booking;

  if p_use_subscription then
    update public.subscriptions
    set
      used_lessons = used_lessons + 1,
      status = case
        when used_lessons + 1 >= total_lessons then 'used_up'
        else status
      end
    where id = v_subscription.id;
  end if;

  return v_booking;
end;
$$;

revoke all on function public.create_pitfly_booking(uuid, text, boolean) from public;
grant execute on function public.create_pitfly_booking(uuid, text, boolean) to authenticated;
