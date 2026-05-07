import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE ENV kosong');
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

export default async function handler(req, res) {
  try {

    // =========================
    // GET DATA
    // =========================
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('kas')
        .select('*');

      if (error) {
        return res.status(500).json(error);
      }

      return res.status(200).json(data);
    }

    // =========================
    // TAMBAH DATA
    // =========================
    if (req.method === 'POST') {
      const newData = req.body;

      const { error } = await supabase
        .from('kas')
        .insert([newData]);

      if (error) {
        return res.status(500).json(error);
      }

      return res.status(200).json({
        status: 'ok'
      });
    }

    // =========================
    // EDIT DATA
    // =========================
    if (req.method === 'PUT') {
      const { id, ...updatedData } = req.body;

      const { error } = await supabase
        .from('kas')
        .update(updatedData)
        .eq('id', id);

      if (error) {
        return res.status(500).json(error);
      }

      return res.status(200).json({
        status: 'updated'
      });
    }

    // =========================
    // DELETE DATA
    // =========================
    if (req.method === 'DELETE') {
      const { id } = req.body;

      const { error } = await supabase
        .from('kas')
        .delete()
        .eq('id', id);

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

    console.error('API KAS ERROR:', err);

    return res.status(500).json({
      error: err.message
    });
  }
}