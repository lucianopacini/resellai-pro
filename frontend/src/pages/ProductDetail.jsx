// =========================
// IMPORT
// =========================

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    getProductById,
    getAISuggestion,
    getAIDescription,
    getAITitle,
    getAIMarketScore,
    getAIStrengths,
    getAIIdealCustomer
} from "../services/api";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // ========================= 
    // STATE
    // =========================

    // Stato prodotto
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Zoom immagine dettaglio
    const [isImageOpen, setIsImageOpen] = useState(false);

    // Stato animazione AI
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Risultati AI 
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [aiDescription, setAiDescription] = useState(null);
    const [aiTitle, setAiTitle] = useState(null);
    const [aiMarketScore, setAiMarketScore] = useState(null);
    const [aiStrengths, setAiStrengths] = useState(null);
    const [aiIdealCustomer, setAiIdealCustomer] = useState(null);

    // Stato sezioni AI
    const [showCustomer, setShowCustomer] = useState(false);
    const [showStrengths, setShowStrengths] = useState(false);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    // Stato caricamento AI
    const [aiDescLoading, setAiDescLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    // =========================
    // EFFECTS
    // =========================

    // Recupera il prodotto corrente dal database
    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(id);
            console.log("PRODOTTO:", data); // 👈 debug utile
            setProduct(data);
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    // Effetto scrittura AI stile ChatGPT
    useEffect(() => {
        if (!aiSuggestion) return;

        let index = 0;

        setDisplayedText("");
        setIsTyping(true);

        const interval = setInterval(() => {
            setDisplayedText(aiSuggestion.slice(0, index));
            index++;

            if (index > aiSuggestion.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 20);

        return () => clearInterval(interval);

    }, [aiSuggestion]);

    // Resetta stato AI quando cambia prodotto
    useEffect(() => {
        setAiSuggestion(null);
        setAiDescription(null);
        setAiLoading(false);
        setAiDescLoading(false);
        setAiStrengths(null);
        setAiIdealCustomer(null);
    }, [id]);

    // Chiusura modal con tasto esc
    useEffect(() => {

        if (isImageOpen) {

            const handleKeyDown = (e) => {

                if (e.key === "Escape") {
                    setIsImageOpen(false);
                }

            };

            window.addEventListener("keydown", handleKeyDown);

            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }

    }, [isImageOpen]);

    // =========================
    // RENDER CONDITIONS
    // =========================

    if (loading) {
        return <p style={{ padding: "20px" }}>Caricamento...</p>;
    }

    if (!product) {
        return (
            <div style={{ padding: "20px" }}>
                <h2>Prodotto non trovato</h2>
                <p>ID: {id}</p>
                <button onClick={() => navigate("/")}>⬅ Torna indietro</button>
            </div>
        );
    }

    // =========================
    // FUNCTIONS & HANDLERS
    // =========================

    // Verifica se il prodotto è stato creato nelle ultime 24 ore
    const isNew = (date) => {
        const created = new Date(date);
        const now = new Date();
        const diff = (now - created) / (1000 * 60 * 60);
        return diff < 24;
    };

    // Avvia l'analisi AI del prodotto
    const handleAIAnalyze = async () => {
        if (!product) return;

        // evita richieste doppie
        if (aiSuggestion && aiDescription) return;

        setAiLoading(true);
        setAiDescLoading(true);

        try {
            const [priceData, descData, titleData, scoreData, strengthsData, customerData] = await Promise.all([
                getAISuggestion(product),
                getAIDescription(product),
                getAITitle(product),
                getAIMarketScore(product),
                getAIStrengths(product),
                getAIIdealCustomer(product)
            ]);

            setAiSuggestion(priceData.suggestion);
            setAiDescription(descData.description);
            setAiTitle(titleData.title);
            setAiMarketScore(scoreData.score);
            setAiStrengths(strengthsData.strengths);
            setAiIdealCustomer(customerData.idealCustomer);

        } catch (error) {
            console.error(error);
            setAiSuggestion("Errore AI");
            setAiDescription("Errore AI");
        } finally {
            setAiLoading(false);
            setAiDescLoading(false);
        }
    };

    // =========================
    // RETURN JSX
    // =========================

    return (
        <div className="product-detail">

            {/* IMMAGINE PRODOTTO */}
            <div>
                {product.image_url && (
                    <img
                        src={product.image_url}
                        alt="prodotto"
                        style={{
                            width: "100%",
                            borderRadius: "12px"
                        }}
                        onClick={() => setIsImageOpen(true)}
                    />
                )}
            </div>

            {/* DETTAGLI PRODOTTO + AI */}
            <div className="product-info">
                <button className="back-btn" onClick={() => navigate("/")}>
                    ← Torna indietro
                </button>

                <h1 className="product-title">{product.brand}</h1>

                {isNew(product.created_at) && (
                    <span className="badge-new">NUOVO</span>
                )}

                <p><strong>Categoria:</strong> {product.category}</p>
                <p><strong>Taglia:</strong> {product.size}</p>
                <p><strong>Condizione:</strong> {product.condition}</p>

                <p className="date">
                    Creato il: {new Date(product.created_at).toLocaleString("it-IT")}
                </p>

                {/* Bottone AI */}

                <button
                    onClick={handleAIAnalyze}
                    disabled={aiLoading}
                    style={{
                        marginTop: "10px",
                        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                        color: "white",
                        border: "none",
                        padding: "12px",
                        borderRadius: "10px",
                        cursor: aiLoading ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        opacity: aiLoading ? 0.7 : 1
                    }}
                >
                    {aiLoading
                        ? "🤖 AI sta analizzando..."
                        : aiSuggestion && aiDescription
                            ? "✅ Già analizzato"
                            : "✨ Analizza prodotto"}
                </button>

                {/* Risultati AI */}
                {(aiSuggestion || aiDescription) && (
                    <div
                        className="ai-result-box"
                        style={{
                            marginTop: "20px",
                            padding: "15px",
                            background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
                            borderRadius: "12px"
                        }}>
                        <strong>🤖 AI Assistant</strong>

                        {aiTitle && (
                            <p style={{
                                marginTop: "10px",
                                fontWeight: "bold",
                                fontSize: "18px"
                            }}>
                                🏷️ {aiTitle}
                            </p>
                        )}

                        {aiMarketScore && (
                            <p style={{
                                marginTop: "10px",
                                color: "#92400e",
                                fontWeight: "bold"
                            }}>
                                ⭐ {aiMarketScore}
                            </p>
                        )}

                        <div>
                            {aiIdealCustomer && (
                                <>
                                    <button
                                        onClick={() => setShowCustomer(!showCustomer)}
                                    >
                                        {showCustomer ? "▼" : "▶"} 👤 Cliente ideale
                                    </button>

                                    {showCustomer && (
                                        <p
                                            style={{
                                                marginTop: "10px",
                                                color: "#374151",
                                                lineHeight: "1.7"
                                            }}
                                        >
                                            {aiIdealCustomer}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>


                        <div>
                            {aiStrengths && (
                                <>
                                    <button
                                        onClick={() => setShowStrengths(!showStrengths)}
                                    >
                                        {showStrengths ? "▼" : "▶"} ⚡ Punti di forza
                                    </button>

                                    {showStrengths && (
                                        <p
                                            style={{
                                                marginTop: "10px",
                                                color: "#374151",
                                                lineHeight: "1.7"
                                            }}
                                        >
                                            {aiStrengths}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        <div>
                            {aiSuggestion && (
                                <>
                                    <button
                                        onClick={() => setShowSuggestion(!showSuggestion)}
                                    >
                                        {showSuggestion ? "▼" : "▶"} 💰 Prezzo
                                    </button>

                                    {showSuggestion && (
                                        <p
                                            style={{
                                                marginTop: "10px",
                                                color: "#374151",
                                                lineHeight: "1.7"
                                            }}
                                        >
                                            {aiSuggestion}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                        {/* {aiSuggestion && (
                            <p style={{ marginTop: "10px" }}>
                                💰 {displayedText}
                                {isTyping && <span className="typing-cursor">|</span>}
                            </p>
                        )} */}

                        <div>
                            {aiDescription && (
                                <>
                                    <button
                                        onClick={() => setShowDescription(!showDescription)}
                                    >
                                        {showDescription ? "▼" : "▶"} 📝 Descrizione
                                    </button>

                                    {showDescription && (
                                        <p
                                            style={{
                                                marginTop: "10px",
                                                color: "#374151",
                                                lineHeight: "1.7"
                                            }}
                                        >
                                            {aiDescription}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>


                    </div>
                )}


            </div>

            {isImageOpen && (
                <div
                    className="image-modal"
                    onClick={() => setIsImageOpen(false)}
                >
                    <img
                        src={product.image_url}
                        alt="prodotto grande"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        onClick={() => setIsImageOpen(false)}
                    >
                        ✕
                    </button>

                </div>
            )}
        </div>
    );
}


export default ProductDetail;