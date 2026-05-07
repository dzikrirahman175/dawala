import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {

  try {

    // =========================
    // GET USER
    // =========================
    if (req.method === 'GET') {

      const { data, error } = await supabase
        .from('user')
        .select('*');

      if (error) {
        return res.status(500).json(error);
      }

      return res.status(200).json(data);
    }

    // =========================
    // TAMBAH USER
    // =========================
    if (req.method === 'POST') {

      const { error } = await supabase
        .from('user')
        .insert([req.body]);

      if (error) {
        return res.status(500).json(error);
      }

      return res.status(200).json({
        status: 'ok'
      });
    }

    // =========================
    // HAPUS USER
    // =========================
    if (req.method === 'DELETE') {

      const { username } = req.body;

      const { error } = await supabase
        .from('user')
        .delete()
        .eq('username', username);

      if (error) {
        return res.status(500).json(error);
      }

      return res.status(200).json({
        status: 'deleted'
      });
    }

    return res.status(405).json({
      error: 'Method not allowed'
    });

  } catch (err) {

    console.error('PENGGUNA API ERROR:', err);

    return res.status(500).json({
      error: err.message
    });
  }
}