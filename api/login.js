import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  console.log("ENV URL:", process.env.SUPABASE_URL);

  const { data, error } = await supabase.from('users').select('*');

  console.log("DATA:", data);
  console.log("ERROR:", error);

  return res.json({ data, error });
}
