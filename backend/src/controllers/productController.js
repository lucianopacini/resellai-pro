const supabase = require("../config/supabaseClient");

const {
    filterProductFields,
    validateCreateProduct,
    validateUpdateProduct,
} = require("../utils/productValidation");

const getProducts = async (req, res) => {

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", req.user.id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
};

const createProduct = async (req, res) => {

    const productData = filterProductFields(req.body);

    const validation = validateCreateProduct(productData);

    if (!validation.valid) {
        return res.status(400).json({
            error: validation.message,
        });
    }

    productData.user_id = req.user.id;

    const { data, error } = await supabase.from("products").insert([productData]);

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

    const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .eq("user_id", req.user.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
        return res.status(403).json({
            error: "Non puoi eliminare questo prodotto.",
        });
    }

    res.json({
        message: "Prodotto eliminato con successo",
    });
};

const updateProduct = async (req, res) => {
    const { id } = req.params;

    const productData = filterProductFields(req.body);

    const validation = validateUpdateProduct(productData);

    if (!validation.valid) {
        return res.status(400).json({
            error: validation.message,
        });
    }

    const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", id)
        .eq("user_id", req.user.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
        return res.status(403).json({
            error: "Non puoi modificare questo prodotto.",
        });
    }

    res.json({ message: "Prodotto aggiornato con successo" });
};

module.exports = {
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
};

