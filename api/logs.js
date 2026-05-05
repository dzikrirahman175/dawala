import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data } = await supabase
      .from('logs')
      .select('*')
      .order('timestamp', { ascending: false });

    return res.json(data);
  }

  if (req.method === 'POST') {
    const { error } = await supabase.from('logs').insert([req.body]);

    if (error) return res.status(500).json(error);

    return res.json({ status: 'ok' });
  }

  res.status(405).end();
}