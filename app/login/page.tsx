'use client';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}` }, // ログイン後トップへ戻る
    });
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>ログイン</h1>
      <button onClick={signIn}>Googleでログイン</button>
    </main>
  );
}
