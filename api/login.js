import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  console.log("MASUK API LOGIN");
  console.log("Request Body:", req.body);

  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('username', username)
    .eq('password', password);

  if (error) {
    console.error("ERROR SUPABASE:", error);
    return res.status(500).json({ error: 'Database error' });
  }

  if (!data || data.length === 0) {
    return res.status(401).json({ status: 'error' });
  }

  return res.status(200).json({
    status: 'ok',
    user: data[0]
  });
}