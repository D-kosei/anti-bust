'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogoutButton } from './components/LogoutButton';

function toTier(x: number) {
  if (x >= 95) return '大吉';
  if (x >= 80) return '吉';
  if (x >= 60) return '中吉';
  if (x >= 40) return '小吉';
  return '凶';
}

export default function Home() {
  const router = useRouter();
  const [pRate, setPRate] = useState('0.6');
  const [pulls, setPulls] = useState('10');
  const [prayed, setPrayed] = useState(false);
  const [checklist, setChecklist] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('profiles').upsert({ id: user.id });
    })();
  }, []);

  const handleRoll = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const raw = Math.floor(Math.random() * 100); // 0..99
    const boost = (prayed ? 8 : 0) + Number(checklist);
    const final = Math.min(99, raw + boost);
    const tier = toTier(final);

    const { error } = await supabase.from('fortunes').insert({
      user_id: user.id,
      raw, final, tier,
      prayed,
      checklist_count: checklist,
      p_rate: Number(pRate),
      pulls: Number(pulls),
    });
    if (error) { alert(`保存失敗：${error.message}`); return; }
    alert(`結果：${tier}（raw:${raw}→final:${final}）を保存しました．`);
  };

  return (
    <main style={{ padding: 24, display: 'grid', gap: 12 }}>
      <h1>爆死回避アプリ（試作）</h1>

      <label>単発排出率（％小数，例0.6）：
        <input value={pRate} onChange={e => setPRate(e.target.value)} />
      </label>
      <label>回せる回数：
        <input value={pulls} onChange={e => setPulls(e.target.value)} />
      </label>
      <label>
        <input type="checkbox" checked={prayed} onChange={e => setPrayed(e.target.checked)} />
        祈願する（＋8％）
      </label>
      <label>運を上げる行動の件数（＋1％/件）：
        <input type="number" value={checklist} onChange={e => setChecklist(Number(e.target.value))} />
      </label>

      <button onClick={handleRoll}>占う→DBに記録</button>
      <Link href="/history">履歴を見る</Link>
      <LogoutButton />
    </main>
  );
}
