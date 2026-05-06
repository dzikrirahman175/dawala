import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  console.log("MASUK API LOGIN");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    console.log("ENV:", process.env.SUPABASE_URL);

    const { username, password } = req.body;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(500).json({ error });
    }

    if (!data || data.length === 0) {
      return res.status(401).json({ status: 'error' });
    }

    return res.status(200).json({
      status: 'ok',
      user: data[0]
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: 'Server crash' });
  }
}