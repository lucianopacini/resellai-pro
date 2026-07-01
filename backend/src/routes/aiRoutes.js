// backend/src/routes/aiRoutes.js
const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/suggest-price", async (req, res) => {
    try {
        const { product } = req.body;

        const prompt = `
Suggerisci un prezzo per questo prodotto:
Brand: ${product.brand}
Categoria: ${product.category}
Condizione: ${product.condition}
Taglia: ${product.size}

Restituisci i dati in formato JSON con queste proprietà:
suggested_price, price_min, price_max e motivation.

suggested_price, price_min e price_max devono essere numeri interi.
motivation deve essere una stringa.

Restituisci esclusivamente un oggetto JSON valido, senza blocchi Markdown, senza json e senza testo aggiuntivo.
        `;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const result = response.choices[0].message.content;

        res.json({ suggestion: result });
    } catch (error) {
        console.error("ERRORE AI:", error);
        res.status(500).json({ error: "Errore AI" });
    }
});

router.post("/generate-description", async (req, res) => {
    try {
        const { product } = req.body;

        const prompt = `
    Scrivi una descrizione accattivante per vendere questo prodotto online.

            Brand: ${product.brand}
        Categoria: ${product.category}
        Condizione: ${product.condition}
        Taglia: ${product.size}

    Deve sembrare un annuncio reale(tipo Vinted / Subito), breve ma efficace.
    `;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const result = response.choices[0].message.content;

        res.json({ description: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Errore AI descrizione" });
    }
});

router.post("/generate-title", async (req, res) => {
    try {
        const { product } = req.body;

        const prompt = `
        Crea un titolo breve e accattivante per un annuncio marketplace.

            Brand: ${product.brand}
        Categoria: ${product.category}
        Condizione: ${product.condition}
        Taglia: ${product.size}

        Il titolo deve sembrare professionale e realistico.
        `;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const result = response.choices[0].message.content;

        res.json({ title: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Errore AI titolo" });
    }
});

router.post("/market-score", async (req, res) => {
    try {
        const { product } = req.body;

        const prompt = `
        Analizza questo prodotto marketplace.

            Brand: ${product.brand}
        Categoria: ${product.category}
        Condizione: ${product.condition}
        Taglia: ${product.size}

        Rispondi con:
        - probabilità di vendita
            - appeal del brand
                - breve motivazione

        Stile breve, moderno e realistico.
        `;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const result = response.choices[0].message.content;

        res.json({ score: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Errore AI market score" });
    }
});

router.post("/product-strengths", async (req, res) => {
    try {
        const { product } = req.body;

        const prompt = `
        Analizza questo prodotto marketplace.

            Brand: ${product.brand}
        Categoria: ${product.category}
        Condizione: ${product.condition}
        Taglia: ${product.size}

        Elenca massimo 3 punti di forza che rendono il prodotto interessante per un potenziale acquirente.

        Rispondi in modo breve usando punti elenco.
        `;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const result = response.choices[0].message.content;

        res.json({ strengths: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Errore AI strengths" });
    }
});

router.post("/ideal-customer", async (req, res) => {
    try {
        const { product } = req.body;

        const prompt = `
Analizza questo prodotto marketplace.

            Brand: ${product.brand}
        Categoria: ${product.category}
        Condizione: ${product.condition}
        Taglia: ${product.size}

Identifica il cliente ideale per questo prodotto.

        Rispondi in massimo 3 punti elenco brevi e concreti.
`;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const result = response.choices[0].message.content;

        res.json({
            idealCustomer: result
        });

    } catch (error) {
        console.error("ERRORE AI IDEAL CUSTOMER:", error);

        res.status(500).json({
            error: "Errore AI ideal customer"
        });
    }
});



module.exports = router;






