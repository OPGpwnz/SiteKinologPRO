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

  select count(*) into v_active_count
  from public.bookings
  where slot_id = p_slot_id and status = 'active';

  if v_active_count >= coalesce(v_slot.capacity, 1) then
    raise exception 'slot_full';
  end if;

  if v_service.requires_pair then
    select pair_group_id into v_group_id
    from public.bookings
    where slot_id = p_slot_id and status = 'active' and pair_group_id is not null
    order by created_at
    limit 1;

    if v_group_id is null then
      v_group_id := gen_random_uuid();
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

create or replace function public.cancel_pitfly_booking(p_booking_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_profile public.profiles%rowtype;
  v_booking public.bookings%rowtype;
  v_slot public.slots%rowtype;
begin
  select * into v_profile from public.profiles where id = v_user;
  if v_profile.role <> 'trainer' then
    select * into v_booking
    from public.bookings
    where id = p_booking_id and client_id = v_user
    for update;

    if not found then
      raise exception 'booking_not_found';
    end if;
  else
    select * into v_booking
    from public.bookings
    where id = p_booking_id
    for update;
  end if;

  if v_booking.status = 'cancelled' then
    raise exception 'already_cancelled';
  end if;

  select * into v_slot from public.slots where id = v_booking.slot_id;

  if v_profile.role <> 'trainer'
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
      status = 'active'
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
  where id = p_subscription_id;

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

create policy "Trainer can view all profiles"
on public.profiles for select
to authenticated
using (
  exists (
    select 1 from public.profiles trainer_profile
    where trainer_profile.id = auth.uid()
      and trainer_profile.role = 'trainer'
  )
);

create policy "Trainer can view all subscriptions"
on public.subscriptions for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'trainer'
  )
);

create policy "Trainer can view all bookings"
on public.bookings for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'trainer'
  )
);
