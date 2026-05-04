const supabase = require("../config/supabaseClient");

const getProducts = async (req, res) => {
    const { data, error } = await supabase
        .from("products")
        .select("*");

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
};

const createProduct = async (req, res) => {
    const {
        user_id,
        image_url,
        category,
        brand,
        size,
        condition,
        suggested_price,
        price_min,
        price_max,
        motivation,
        visual_analysis,
    } = req.body;

    const { data, error } = await supabase.from("products").insert([
        {
            user_id,
            image_url,
            category,
            brand,
            size,
            condition,
            suggested_price,
            price_min,
            price_max,
            motivation,
            visual_analysis,
        },
    ]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({
        message: "Prodotto salvato con successo",
        data,
    });
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({
        message: "Prodotto eliminato con successo",
    });
};

const updateProduct = async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from("products")
        .update(req.body)
        .eq("id", id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Prodotto aggiornato con successo" });
};

module.exports = {
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
};

