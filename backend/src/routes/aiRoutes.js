const authMiddleware = require("../middleware/authMiddleware");

const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
});

const callOpenAI = async (prompt, json = false) => {

    const options = {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
    };

    if (json) {
        options.response_format = { type: "json_object" };
    }

    const response = await client.chat.completions.create(options);

    return response.choices[0].message.content;

};


router.post("/analyze-product", authMiddleware, async (req, res) => {
    try {
        const { product } = req.body;

        const prompt = `
Analizza questo prodotto destinato alla vendita su un marketplace.

Dati del prodotto:
Brand: ${product.brand}
Categoria: ${product.category}
Condizione: ${product.condition}
Taglia: ${product.size}

Esegui le seguenti analisi:

1. Prezzo:
Suggerisci un prezzo di vendita realistico.
Restituisci il prezzo suggerito, il prezzo minimo e il prezzo massimo come numeri interi.
Fornisci anche una breve motivazione basata su brand, categoria, condizione e taglia.

2. Descrizione:
Scrivi una descrizione pronta per un annuncio di vendita.
Deve essere un testo unico, fluido e professionale di 4-6 frasi.
Non usare elenchi, titoli, asterischi o Markdown.
Evidenzia naturalmente brand, condizione e punti di forza.

3. Titolo:
Crea un titolo breve, accattivante, professionale e realistico per un annuncio marketplace.

4. Market score:
Valuta il prodotto come farebbe un esperto di marketplace per l'abbigliamento usato.
Fornisci:
- probabilità di vendita
- appeal del brand
- breve motivazione
Mantieni il testo breve, ordinato e naturale.
Non usare Markdown, asterischi o elenchi.

5. Punti di forza:
Individua al massimo 3 punti di forza che rendono il prodotto interessante per un potenziale acquirente.
Per ogni punto usa un breve titolo seguito da una breve spiegazione.
Scrivi in italiano, senza Markdown, asterischi o elenchi numerati o puntati.

6. Cliente ideale:
Descrivi al massimo 3 tipologie di clienti interessati al prodotto.
Per ogni tipologia usa un breve titolo seguito da una breve spiegazione.
Scrivi in italiano, senza Markdown, asterischi o elenchi numerati o puntati.

Restituisci esclusivamente un unico oggetto JSON valido con questa struttura:

{
  "suggested_price": numero intero,
  "price_min": numero intero,
  "price_max": numero intero,
  "motivation": "stringa",
  "description": "stringa",
  "title": "stringa",
  "market_score": "stringa",
  "strengths": "stringa",
  "ideal_customer": "stringa"
}

Non aggiungere testo al di fuori dell'oggetto JSON.
`;

        const result = await callOpenAI(prompt, true);

        const parsedResult = JSON.parse(result);

        res.json(parsedResult);

    } catch (error) {
        console.error("ERRORE AI ANALISI:", error);

        res.status(500).json({
            error: "Errore analisi AI"
        });
    }
});


module.exports = router;






