create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_name text;
  profile_role text;
begin
  profile_name := coalesce(
    nullif(new.raw_user_meta_data->>'name', ''),
    split_part(new.email, '@', 1)
  );

  profile_role := case
    when new.raw_user_meta_data->>'role' in ('trainer', 'student') then new.raw_user_meta_data->>'role'
    else 'student'
  end;

  insert into public.profiles (id, name, role)
  values (new.id, profile_name, profile_role)
  on conflict (id) do update
  set
    name = excluded.name,
    role = excluded.role;

  return new;
end;
$$;

drop trigger if exists create_profile_on_signup on auth.users;

create trigger create_profile_on_signup
after insert on auth.users
for each row
execute function public.handle_new_user_profile();
