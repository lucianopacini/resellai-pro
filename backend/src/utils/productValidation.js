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
        description,
        title,
        market_score,
        strengths,
        ideal_customer,
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
        description,
        title,
        market_score,
        strengths,
        ideal_customer,
        visual_analysis,
    };
}

function validateCreateProduct(product) {
    const {
        brand,
        category,
        size,
        condition,
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

    if (
        visual_analysis !== undefined &&
        typeof visual_analysis !== "string"
    ) {
        return {
            valid: false,
            message: "L'analisi visiva deve essere una stringa.",
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
        description,
        title,
        market_score,
        strengths,
        ideal_customer,
        visual_analysis,
    } = product;

    if (
        suggested_price !== undefined &&
        typeof suggested_price !== "number"
    ) {
        return {
            valid: false,
            message: "Il prezzo suggerito deve essere un numero.",
        };
    }

    if (suggested_price !== undefined && suggested_price < 0) {
        return {
            valid: false,
            message: "Il prezzo suggerito non può essere negativo.",
        };
    }

    if (price_min !== undefined &&
        typeof price_min !== "number"
    ) {
        return {
            valid: false,
            message: "Il prezzo minimo deve essere un numero.",
        };
    }

    if (price_min !== undefined && price_min < 0) {
        return {
            valid: false,
            message: "Il prezzo minimo non può essere negativo.",
        };
    }

    if (price_max !== undefined &&
        typeof price_max !== "number"
    ) {
        return {
            valid: false,
            message: "Il prezzo massimo deve essere un numero.",
        };
    }

    if (price_max !== undefined && price_max < 0) {
        return {
            valid: false,
            message: "Il prezzo massimo non può essere negativo.",
        };
    }

    if (
        motivation !== undefined &&
        typeof motivation !== "string"
    ) {
        return {
            valid: false,
            message: "La motivazione deve essere una stringa.",
        };
    }

    if (
        description !== undefined &&
        typeof description !== "string"
    ) {
        return {
            valid: false,
            message: "La descrizione deve essere una stringa.",
        };
    }

    if (
        title !== undefined &&
        typeof title !== "string"
    ) {
        return {
            valid: false,
            message: "Il titolo deve essere una stringa.",
        };
    }

    if (
        market_score !== undefined &&
        typeof market_score !== "string"
    ) {
        return {
            valid: false,
            message: "Il market score deve essere una stringa.",
        };
    }

    if (
        strengths !== undefined &&
        typeof strengths !== "string"
    ) {
        return {
            valid: false,
            message: "I punti di forza devono essere una stringa.",
        };
    }

    if (
        ideal_customer !== undefined &&
        typeof ideal_customer !== "string"
    ) {
        return {
            valid: false,
            message: "Il cliente ideale deve essere una stringa.",
        };
    }

    if (
        visual_analysis !== undefined &&
        typeof visual_analysis !== "string"
    ) {
        return {
            valid: false,
            message: "L'analisi visiva deve essere una stringa.",
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