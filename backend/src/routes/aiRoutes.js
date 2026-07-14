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
Analizza questo prodotto marketplace.

Brand: ${product.brand}
Categoria: ${product.category}
Condizione: ${product.condition}
Taglia: ${product.size}

Scrivi una descrizione pronta per un annuncio di vendita.

Regole:
- Scrivi un unico testo fluido.
- Non usare punti elenco.
- Non usare asterischi o Markdown.
- Non usare titoli.
- Evidenzia il brand, la condizione e i punti di forza del prodotto in modo naturale.
- Mantieni un tono professionale ma coinvolgente.
- Lunghezza massima: 4-6 frasi.
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

Valuta il prodotto come farebbe un esperto di marketplace per l'abbigliamento usato.

Scrivi un testo breve, ordinato e facile da leggere.

Regole:
- Non usare Markdown.
- Non usare asterischi.
- Non usare punti elenco.
- Non usare titoli in grassetto.
- Mantieni ogni sezione composta da 1 o 2 frasi.

Organizza la risposta con queste tre sezioni:

Probabilità di vendita:
Appeal del brand:
Breve motivazione:

Usa un tono professionale, naturale e realistico.
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
Analizza questo prodotto destinato alla vendita su un marketplace.

Brand: ${product.brand}
Categoria: ${product.category}
Condizione: ${product.condition}
Taglia: ${product.size}

Elenca al massimo 3 punti di forza che rendono questo prodotto interessante per un potenziale acquirente.

Regole:
- Scrivi in italiano.
- Usa un linguaggio naturale e professionale.
- Non usare Markdown.
- Non usare asterischi (**).
- Non usare elenchi puntati o numerati.
- Ogni punto di forza deve essere composto da un breve titolo seguito da una breve spiegazione.

Esempio di formato:

Qualità del marchio: Brand riconosciuto e apprezzato per affidabilità e stile.

Condizioni eccellenti: Il capo è in ottimo stato e pronto per essere utilizzato.

Taglia ricercata: La taglia disponibile può risultare interessante per una fascia specifica di acquirenti.
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
Analizza questo prodotto destinato alla vendita su un marketplace.

Brand: ${product.brand}
Categoria: ${product.category}
Condizione: ${product.condition}
Taglia: ${product.size}

Descrivi il cliente ideale per questo prodotto.

Regole:
- Scrivi in italiano.
- Usa un linguaggio naturale e professionale.
- Non usare Markdown.
- Non usare asterischi (**).
- Non usare elenchi puntati o numerati.
- Descrivi al massimo 3 tipologie di clienti.
- Per ogni tipologia scrivi un breve titolo seguito da una breve spiegazione.

Esempio:

Appassionati di sport: Persone che cercano capi tecnici e confortevoli per l'attività fisica.

Persone di corporatura robusta: Clienti che necessitano di taglie ampie senza rinunciare allo stile.

Amanti del brand: Consumatori che apprezzano la qualità e la reputazione del marchio.
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






