create or replace function public.handle_pitfly_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'client')
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$function$;

revoke all on function public.handle_pitfly_new_auth_user() from public, anon, authenticated;

drop trigger if exists create_pitfly_profile_on_signup on auth.users;
create trigger create_pitfly_profile_on_signup
  after insert on auth.users
  for each row execute function public.handle_pitfly_new_auth_user();
