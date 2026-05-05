import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data } = await supabase.from('kas').select('*');
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { role, ...newData } = req.body;

    if (role !== 'admin') {
      return res.status(403).json({ error: 'Hanya admin' });
    }

    const { error } = await supabase.from('kas').insert([newData]);

    if (error) return res.status(500).json(error);

    return res.json({ status: 'ok' });
  }

  res.status(405).end();
}