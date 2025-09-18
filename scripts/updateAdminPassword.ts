import { supabaseAdmin } from '../src/lib/supabase';

async function updatePassword() {
  if (!supabaseAdmin) {
    console.error('supabaseAdmin is not configured.');
    process.exit(1);
  }
  const { error } = await supabaseAdmin
    .from('admin_users')
    .update({ password_hash: '$2b$10$7yyUMRRlphkL5jegtH/AaeiylZk/4Co9bR9.jvDSj.D1OV2HKuq2G' })
    .eq('email', 'info5elbaker@gmail.com');
  if (error) {
    console.error('Failed to update password:', error.message);
    process.exit(1);
  }
  console.log('Password updated successfully for info5elbaker@gmail.com');
  process.exit(0);
}

updatePassword(); 