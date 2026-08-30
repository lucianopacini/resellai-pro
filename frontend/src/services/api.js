import { supabase } from "./supabaseClient";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
        throw new Error("Utente non autenticato.");
    }

    return {
        "Authorization": `Bearer ${data.session.access_token}`,
    };
};

export const createProduct = async (productData) => {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders,
        },
        body: JSON.stringify(productData),
    });

    return response.json();
};


export const getProducts = async () => {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_URL}/products`, {
        method: "GET",
        headers: {
            ...authHeaders,
        },
    });

    return response.json();
};


export const deleteProduct = async (id) => {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
            ...authHeaders,
        },
    });

    return response.json();
};


export const updateProduct = async (id, productData) => {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders,
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


export const getAIAnalysis = async (product) => {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_URL}/api/ai/analyze-product`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders,
        },
        body: JSON.stringify({ product }),
    });

    return response.json();
};