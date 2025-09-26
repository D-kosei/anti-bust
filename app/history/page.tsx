'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Row = {
  id: string; created_at: string;
  raw: number; final: number; tier: string;
  prayed: boolean; checklist_count: number;
};

export default function History() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { location.href = '/login'; return; }
      const { data, error } = await supabase
        .from('fortunes').select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error) setRows(data || []);
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>占い履歴（直近20件）</h1>
      <ul>
        {rows.map(r => (
          <li key={r.id}>
            {new Date(r.created_at).toLocaleString()} ／ {r.tier}
            ／ raw:{r.raw} → final:{r.final} ／ 祈願:{r.prayed ? 'あり' : 'なし'} ／ 行動:{r.checklist_count}
          </li>
        ))}
      </ul>
      <Link href="/">戻る</Link>
    </main>
  );
}
