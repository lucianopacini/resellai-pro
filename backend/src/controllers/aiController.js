const { callOpenAI } = require("../utils/openai");

const analyzeProduct = async (req, res) => {
    try {

        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({
                error: "Body della richiesta non valido.",
            });
        }

        const { product } = req.body;

        if (!product) {
            return res.status(400).json({
                error: "Dati prodotto mancanti",
            });
        }

        if (
            typeof product.brand !== "string" ||
            !product.brand.trim() ||
            typeof product.category !== "string" ||
            !product.category.trim() ||
            typeof product.condition !== "string" ||
            !product.condition.trim() ||
            typeof product.size !== "string" ||
            !product.size.trim()
        ) {
            return res.status(400).json({
                error: "Dati prodotto non validi",
            });
        }

        if (
            typeof product.image_url !== "string" ||
            !product.image_url.trim()
        ) {
            return res.status(400).json({
                error: "Immagine del prodotto mancante.",
            });
        }


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

7. Analisi visiva e controllo di coerenza:
Analizza prima l'immagine in modo indipendente dai dati testuali forniti dall'utente.

Descrivi esclusivamente ciò che è effettivamente visibile nella fotografia:
tipologia apparente del capo, colore, stile, dettagli visibili ed eventuali difetti evidenti.

Confronta poi ciò che osservi nell'immagine con:
Brand: ${product.brand}
Categoria: ${product.category}
Condizione: ${product.condition}
Taglia: ${product.size}

Se l'immagine non è coerente con uno o più dati dichiarati dall'utente,
devi segnalarlo chiaramente nell'analisi.

Non modificare mentalmente la fotografia per renderla coerente con i dati testuali.
Se, ad esempio, i dati indicano "pantaloni" ma nell'immagine compare una
maglietta, scrivi esplicitamente che esiste una possibile incongruenza.

Non inventare informazioni che non possono essere verificate dall'immagine.

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
  "ideal_customer": "stringa",
  "visual_analysis": "stringa"
}

Non aggiungere testo al di fuori dell'oggetto JSON.
`;

        const result = await callOpenAI(
            prompt,
            true,
            product.image_url
        );

        const parsedResult = JSON.parse(result);

        res.json(parsedResult);

    } catch (error) {
        console.error("ERRORE AI ANALISI:", error);

        res.status(500).json({
            error: "Errore analisi AI"
        });
    }
};

module.exports = {
    analyzeProduct,
};