import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

(async () => {
  const { supabaseAdmin } = await import('../src/lib/supabase');
  const { hashPassword } = await import('../src/lib/auth');

  if (!supabaseAdmin) {
    console.error('Supabase admin client not configured. Check your env variables.');
    process.exit(1);
  }

  const email = 'admin@shop.com';
  const password = 'admin123';

  // Check if admin already exists
  const { data: exists, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (fetchError) {
    console.error('Error checking admin existence:', fetchError);
    process.exit(1);
  }

  if (!exists) {
    const hashed = await hashPassword(password);
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        name: 'Admin',
        email,
        password: hashed,
        role: 'admin',
      });

    if (insertError) {
      console.error('Error seeding admin user:', insertError);
      process.exit(1);
    }
    console.log(`Admin created successfully in Supabase: ${email} / ${password}`);
  } else {
    console.log('Admin already exists.');
  }
  process.exit(0);
})();