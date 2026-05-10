import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export default async function handler(req, res) {

    try {

        // =========================
        // GET
        // =========================
        if (req.method === 'GET') {

            const { data, error } = await supabase
                .from('galeri')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;

            return res.status(200).json(data);
        }

        // =========================
        // POST
        // =========================
        if (req.method === 'POST') {

            const body = req.body;

            const { data, error } = await supabase
                .from('galeri')
                .insert([body]);

            if (error) throw error;

            return res.status(200).json(data);
        }

        // =========================
        // PUT
        // =========================
        if (req.method === 'PUT') {

            const body = req.body;

            const { id, ...updateData } = body;

            const { data, error } = await supabase
                .from('galeri')
                .update(updateData)
                .eq('id', id);

            if (error) throw error;

            return res.status(200).json(data);
        }

        // =========================
        // DELETE
        // =========================
        if (req.method === 'DELETE') {

            const { id } = req.body;

            const { error } = await supabase
                .from('galeri')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return res.status(200).json({
                success: true
            });
        }

        return res.status(405).json({
            error: 'Method not allowed'
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: err.message
        });

    }
}