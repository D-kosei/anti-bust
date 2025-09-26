'use client';
import { supabase } from '@/lib/supabase';

export function LogoutButton() {
  const onClick = async () => {
    await supabase.auth.signOut();
    location.href = '/';
  };
  return <button onClick={onClick}>ログアウト</button>;
}
