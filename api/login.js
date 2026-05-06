import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('username', username)
<<<<<<< HEAD
    .eq('password', password);
=======
    .eq('password', password)
>>>>>>> e5e18fa5cee887c4f761659c48c6c51f11791b09

  if (error || !data || data.length === 0) {
    return res.status(401).json({ status: 'error' });
  }

  return res.status(200).json({
    status: 'ok',
    user: data[0]
  });
}
