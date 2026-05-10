export default async function handler(req, res) {

    try {

        return res.status(200).json({
            success: true,
            message: 'API berjalan'
        });

    } catch (err) {

        return res.status(500).json({
            error: err.message
        });

    }

}