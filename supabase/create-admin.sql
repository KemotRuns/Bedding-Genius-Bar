-- ============================================================================
--  Create an admin login for the /admin panel.
--  Edit the two values below, then run this in the Supabase SQL Editor.
--  Re-running with the same email just ensures that account is an admin.
-- ============================================================================
create extension if not exists pgcrypto with schema extensions;

do $$
declare
  v_email text := 'you@example.com';   -- ← CHANGE: your admin email
  v_pass  text := 'change-this-now';   -- ← CHANGE: a strong password
  v_uid   uuid;
begin
  select id into v_uid from auth.users where email = v_email;

  if v_uid is null then
    v_uid := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', v_uid, 'authenticated', 'authenticated',
      v_email, extensions.crypt(v_pass, extensions.gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}', '{}',
      '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_uid, v_uid::text,
      jsonb_build_object('sub', v_uid::text, 'email', v_email),
      'email', now(), now(), now()
    );
  end if;

  insert into admins (user_id, email) values (v_uid, v_email)
  on conflict (user_id) do nothing;
end $$;

-- ----------------------------------------------------------------------------
-- If the block above ever errors on a future Supabase version, use the
-- dashboard instead: Authentication → Add user (tick "Auto Confirm User"),
-- then run:
--   insert into admins (user_id, email)
--   select id, email from auth.users where email = 'you@example.com'
--   on conflict (user_id) do nothing;
-- ----------------------------------------------------------------------------
