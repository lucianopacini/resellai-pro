function filterProductFields(product) {

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
    } = product;

    return {
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

    }

}

function validateCreateProduct(product) {
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
    } = product;

    if (!brand || typeof brand !== "string") {
        return {
            valid: false,
            message: "Il campo brand è obbligatorio."
        };
    }

    if (!category || typeof category !== "string") {
        return {
            valid: false,
            message: "Il campo category è obbligatorio."
        };
    }

    if (!size || typeof size !== "string") {
        return {
            valid: false,
            message: "Il campo size è obbligatorio."
        };
    }

    if (!condition || typeof condition !== "string") {
        return {
            valid: false,
            message: "Il campo condition è obbligatorio."
        };
    }

    return {
        valid: true,
    };
}



function validateUpdateProduct(product) {
    const {
        suggested_price,
        price_min,
        price_max,
        motivation,
        visual_analysis,
    } = product;

    if (suggested_price === undefined) {
        return {
            valid: false,
            message: "Il campo suggested_price è obbligatorio.",
        };
    }

    if (typeof suggested_price !== "number") {
        return {
            valid: false,
            message: "Il prezzo suggerito deve essere un numero.",
        };
    }

    if (suggested_price <= 0) {
        return {
            valid: false,
            message: "Il prezzo suggerito deve essere maggiore di zero.",
        };
    }

    if (price_min === undefined) {
        return {
            valid: false,
            message: "Il prezzo minimo è obbligatorio.",
        };
    }

    if (typeof price_min !== "number") {
        return {
            valid: false,
            message: "Il prezzo minimo deve essere un numero.",
        };
    }

    if (price_min <= 0) {
        return {
            valid: false,
            message: "Il prezzo minimo deve essere maggiore di zero.",
        };
    }

    if (price_max === undefined) {
        return {
            valid: false,
            message: "Il prezzo massimo è obbligatorio.",
        };
    }

    if (typeof price_max !== "number") {
        return {
            valid: false,
            message: "Il prezzo massimo deve essere un numero.",
        };
    }

    if (price_max <= 0) {
        return {
            valid: false,
            message: "Il prezzo massimo deve essere maggiore di zero.",
        };
    }

    if (!motivation || typeof motivation !== "string") {
        return {
            valid: false,
            message: "La motivazione è obbligatoria.",
        };
    }

    return {
        valid: true,
    };
}


module.exports = {
    filterProductFields,
    validateCreateProduct,
    validateUpdateProduct,
};