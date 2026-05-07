import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {

  try {

    // ======================
    // GET
    // ======================
    if (req.method === 'GET') {

      const { data, error } = await supabase
        .from('warga')
        .select('*');

      if (error) {

        console.error('GET ERROR:', error);

        return res.status(500).json({
          error: error.message
        });
      }

      return res.status(200).json(data);
    }

    // ======================
    // POST
    // ======================
    if (req.method === 'POST') {

      console.log('BODY:', req.body);

      const { data, error } = await supabase
        .from('warga')
        .insert([req.body])
        .select();

      if (error) {

        console.error('INSERT ERROR:', error);

        return res.status(500).json({
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
      }

      return res.status(200).json({
        status: 'ok',
        data
      });
    }

    return res.status(405).json({
      error: 'Method not allowed'
    });

  } catch (err) {

    console.error('SERVER ERROR:', err);

    return res.status(500).json({
      error: err.message
    });
  }
}

if (req.method === 'PUT') {

  const { oldNik, ...updatedData } = req.body;

  const { error } = await supabase
    .from('warga')
    .update(updatedData)
    .eq('nik', oldNik);

  if (error) {
    return res.status(500).json(error);
  }

  return res.status(200).json({
    status: 'updated'
  });
}