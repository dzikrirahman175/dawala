import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  // GET DATA
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('kas').select('*');

    if (error) return res.status(500).json(error);
    return res.json(data);
  }

  // TAMBAH DATA
  if (req.method === 'POST') {
    const { role, ...newData } = req.body;

    if (role !== 'admin') {
      return res.status(403).json({ error: 'Hanya admin' });
    }

    const { error } = await supabase.from('kas').insert([newData]);

    if (error) return res.status(500).json(error);
    return res.json({ status: 'ok' });
  }

  // EDIT DATA
  if (req.method === 'PUT') {
    const { id, ...updatedData } = req.body;

    const { error } = await supabase
      .from('kas')
      .update(updatedData)
      .eq('id', id);

    if (error) return res.status(500).json(error);
    return res.json({ status: 'updated' });
  }

  // DELETE DATA
  if (req.method === 'DELETE') {
    const { id } = req.body;

    const { error } = await supabase
      .from('kas')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json(error);
    return res.json({ status: 'deleted' });
  }

  res.status(405).end();

  //DOWNLOAD DATA
  import XLSX from 'xlsx';

  export default async function handler(req, res) {
  const { data } = await supabase.from('kas').select('*');

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Kas');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Disposition', 'attachment; filename=kas.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
}
}