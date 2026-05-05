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

Rispondi in modo breve con fascia di prezzo e motivazione.
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

    Deve sembrare un annuncio reale (tipo Vinted/Subito), breve ma efficace.
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

module.exports = router;