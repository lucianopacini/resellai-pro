import { supabase } from "./supabaseClient";

const API_URL = "http://localhost:3000";

export const createProduct = async (productData) => {
    const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
    });

    return response.json();
};

export const getProducts = async () => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
    });

    return response.json();
};

export const updateProduct = async (id, productData) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
    });

    return response.json();
};

export const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
        .from("products-images")
        .upload(fileName, file);

    if (error) {
        console.error(error);
        return null;
    }

    const { data: publicUrl } = supabase.storage
        .from("products-images")
        .getPublicUrl(fileName);

    return publicUrl.publicUrl;
};

export const getProductById = async (id) => {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", Number(id))
            .maybeSingle();

        if (error) throw error;

        return data;

    } catch (error) {
        console.error("Errore fetch prodotto:", error);
        return null;
    }
};

export const getAISuggestion = async (product) => {
    const response = await fetch(`${API_URL}/api/ai/suggest-price`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
    });

    return response.json();
};

export const getAIDescription = async (product) => {
    const response = await fetch(`${API_URL}/api/ai/generate-description`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
    });

    return response.json();
};

export const getAITitle = async (product) => {
    const response = await fetch("http://localhost:3000/api/ai/generate-title", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
    });

    return response.json();
};

export const getAIMarketScore = async (product) => {
    const response = await fetch("http://localhost:3000/api/ai/market-score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
    });

    return response.json();
};

export const getAIStrengths = async (product) => {
    const response = await fetch(
        "http://localhost:3000/api/ai/product-strengths",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ product }),
        }
    );

    return response.json();
};

export const getAIIdealCustomer = async (product) => {
    const response = await fetch(
        "http://localhost:3000/api/ai/ideal-customer",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ product }),
        }
    );

    return response.json();
};