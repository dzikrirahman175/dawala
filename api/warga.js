import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {

  // GET
  if (req.method === 'GET') {

    const { data, error } = await supabase
      .from('warga')
      .select('*');

    if (error) {
      return res.status(500).json(error);
    }

    return res.status(200).json(data);
  }

  // POST
  if (req.method === 'POST') {

    const { error } = await supabase
      .from('warga')
      .insert([req.body]);

    if (error) {
      return res.status(500).json(error);
    }

    return res.status(200).json({
      status: 'ok'
    });
  }

  // PUT
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
//=============
  // DELETE
//==============
if (req.method === 'DELETE') {

  const { nik } = req.body;
  if (!nik) {
    return res.status(400).json({ message: "Nik required" });
  }

  const { error } = await supabase
    .from('warga')
    .delete()
    .eq('nik', nik);

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

   // contoh filter data
  data = data.filter(w => w.nik !== nik);

  return res.status(200).json({ message: "Deleted" });
}