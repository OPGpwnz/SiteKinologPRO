create or replace function public.cancel_pitfly_booking(p_booking_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_role text;
  v_booking public.bookings%rowtype;
  v_slot public.slots%rowtype;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  select role into v_role
  from public.profiles
  where id = v_user;
  if not found then
    raise exception 'profile_not_found';
  end if;

  if v_role is distinct from 'trainer' then
    select * into v_booking
    from public.bookings
    where id = p_booking_id and client_id = v_user
    for update;
  else
    select * into v_booking
    from public.bookings
    where id = p_booking_id
    for update;
  end if;

  if not found then
    raise exception 'booking_not_found';
  end if;
  if v_booking.status <> 'active' then
    raise exception 'booking_not_active';
  end if;

  select * into v_slot
  from public.slots
  where id = v_booking.slot_id;

  if v_role is distinct from 'trainer'
    and extract(epoch from (v_slot.starts_at - now())) <= 5 * 60 * 60 then
    raise exception 'five_hour_rule';
  end if;

  update public.bookings
  set status = 'cancelled'
  where id = v_booking.id
  returning * into v_booking;

  if v_booking.subscription_id is not null then
    update public.subscriptions
    set
      used_lessons = greatest(used_lessons - 1, 0),
      status = case when expires_at > now() then 'active' else 'expired' end
    where id = v_booking.subscription_id;
  end if;

  return v_booking;
end;
$$;

revoke all on function public.cancel_pitfly_booking(uuid) from public;
grant execute on function public.cancel_pitfly_booking(uuid) to authenticated;

create or replace function public.mark_pitfly_paid(p_booking_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result public.bookings%rowtype;
begin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'trainer'
  ) then
    raise exception 'not_trainer';
  end if;

  update public.bookings
  set payment_status = 'paid'
  where id = p_booking_id
  returning * into v_result;

  if not found then
    raise exception 'booking_not_found';
  end if;

  return v_result;
end;
$$;

revoke all on function public.mark_pitfly_paid(uuid) from public;
grant execute on function public.mark_pitfly_paid(uuid) to authenticated;

create or replace function public.extend_pitfly_subscription(p_subscription_id uuid)
returns public.subscriptions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result public.subscriptions%rowtype;
  v_base timestamptz;
begin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'trainer'
  ) then
    raise exception 'not_trainer';
  end if;

  select expires_at into v_base
  from public.subscriptions
  where id = p_subscription_id
  for update;

  if not found then
    raise exception 'subscription_not_found';
  end if;

  if v_base < now() then
    v_base := now();
  end if;

  update public.subscriptions
  set expires_at = v_base + interval '45 days',
      status = 'active'
  where id = p_subscription_id
  returning * into v_result;

  return v_result;
end;
$$;

revoke all on function public.extend_pitfly_subscription(uuid) from public;
grant execute on function public.extend_pitfly_subscription(uuid) to authenticated;

create or replace function public.delete_pitfly_slot(p_slot_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'trainer'
  ) then
    raise exception 'not_trainer';
  end if;

  perform 1
  from public.slots
  where id = p_slot_id
  for update;
  if not found then
    raise exception 'slot_not_found';
  end if;

  if exists (
    select 1 from public.bookings
    where slot_id = p_slot_id
  ) then
    raise exception 'slot_has_bookings';
  end if;

  delete from public.slots
  where id = p_slot_id;
end;
$$;

revoke all on function public.delete_pitfly_slot(uuid) from public;
grant execute on function public.delete_pitfly_slot(uuid) to authenticated;
