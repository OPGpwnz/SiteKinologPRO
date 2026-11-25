begin;

-- Preserve a separately recorded payment if the trainer reverses a change.
alter table public.bookings add column payment_before_pass text
  check (payment_before_pass in ('paid', 'unpaid'));

create function public.guard_pitfly_contact_booking() returns trigger
language plpgsql set search_path = '' as $$
begin
  if auth.uid() is not null and exists (
    select 1 from public.services s where s.code = new.service_code
    and (s.code in ('pair','subscription') or s.requires_pair or s.is_subscription)
  ) and not exists (select 1 from public.profiles where id = auth.uid() and role = 'trainer') then
    raise exception 'contact_trainer';
  end if;
  return new;
end
$$;
create trigger pitfly_contact_only before insert on public.bookings
for each row execute function public.guard_pitfly_contact_booking();

create function public.set_pitfly_pass_balance(
  p_client uuid, p_pass uuid, p_remaining integer, p_expected_used integer
) returns void language plpgsql security definer set search_path = '' as $$
declare
  pass public.subscriptions%rowtype;
  linked integer;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'trainer') then
    raise exception 'not_trainer';
  end if;
  -- Serialize issuance for the same owner even when no pass row exists yet.
  perform 1 from public.profiles where id = p_client for update;
  if not found then raise exception 'unknown_client'; end if;
  if p_remaining is null or p_remaining < 0 or p_pass is null then raise exception 'invalid_balance'; end if;
  select * into pass from public.subscriptions where id = p_pass and client_id = p_client for update;
  if p_expected_used is null then
    if found then return; end if; -- retry of the same issuance
    if p_remaining not between 1 and 5 then raise exception 'invalid_balance'; end if;
    if exists (select 1 from public.subscriptions where client_id = p_client
      and status = 'active' and expires_at > now() and used_lessons < total_lessons) then
      raise exception 'active_pass_exists';
    end if;
    insert into public.subscriptions(id, client_id, total_lessons, used_lessons, expires_at, status)
    values (p_pass, p_client, 5, 5 - p_remaining, now() + interval '45 days', 'active');
    return;
  end if;
  if not found or pass.used_lessons <> p_expected_used then raise exception 'stale_balance'; end if;
  if p_remaining > pass.total_lessons then raise exception 'invalid_balance'; end if;
  select count(*) into linked from public.bookings where subscription_id = p_pass and status <> 'cancelled';
  if pass.total_lessons - p_remaining < linked then raise exception 'linked_lessons'; end if;
  update public.subscriptions set used_lessons = total_lessons - p_remaining,
    status = case when expires_at <= now() then 'expired' when p_remaining = 0 then 'used_up' else 'active' end
    where id = p_pass;
end
$$;

create function public.set_pitfly_lesson_pass(p_booking uuid, p_pass uuid, p_previous uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  lesson public.bookings%rowtype;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'trainer') then
    raise exception 'not_trainer';
  end if;
  select * into lesson from public.bookings where id = p_booking for update;
  if not found or lesson.status not in ('active','completed') then raise exception 'lesson_unavailable'; end if;
  if lesson.subscription_id is not distinct from p_pass then return; end if;
  if lesson.subscription_id is distinct from p_previous then raise exception 'stale_balance'; end if;
  if p_pass is null then
    update public.subscriptions set used_lessons = greatest(0, used_lessons - 1),
      status = case when expires_at <= now() then 'expired' else 'active' end
      where id = lesson.subscription_id;
    update public.bookings set subscription_id = null, payment_status = coalesce(payment_before_pass, 'unpaid'),
      payment_before_pass = null where id = p_booking;
  else
    if lesson.subscription_id is not null then raise exception 'stale_balance'; end if;
    update public.subscriptions set used_lessons = used_lessons + 1,
      status = case when used_lessons + 1 = total_lessons then 'used_up' else status end
      where id = p_pass and client_id = lesson.client_id and status = 'active'
        and expires_at > now() and used_lessons < total_lessons;
    if not found then raise exception 'pass_unavailable'; end if;
    update public.bookings set subscription_id = p_pass, payment_before_pass = payment_status,
      payment_status = 'paid' where id = p_booking;
  end if;
end
$$;
revoke all on function public.set_pitfly_pass_balance(uuid,uuid,integer,integer) from public, anon;
revoke all on function public.set_pitfly_lesson_pass(uuid,uuid,uuid) from public, anon;
grant execute on function public.set_pitfly_pass_balance(uuid,uuid,integer,integer) to authenticated;
grant execute on function public.set_pitfly_lesson_pass(uuid,uuid,uuid) to authenticated;
notify pgrst, 'reload schema';
commit;
