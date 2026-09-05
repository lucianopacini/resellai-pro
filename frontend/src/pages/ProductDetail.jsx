// ===== IMPORT =====
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    getProductById,
    updateProduct,
    getAIAnalysis
} from "../services/api";

function ProductDetail({ onProductUpdated }) {
    const { id } = useParams();
    const navigate = useNavigate();

    // ===== STATE =====
    // Stato prodotto
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Zoom immagine dettaglio
    const [isImageOpen, setIsImageOpen] = useState(false);

    // Risultati AI 
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [aiDescription, setAiDescription] = useState(null);
    const [aiTitle, setAiTitle] = useState(null);
    const [aiMarketScore, setAiMarketScore] = useState(null);
    const [aiStrengths, setAiStrengths] = useState(null);
    const [aiIdealCustomer, setAiIdealCustomer] = useState(null);
    const [aiVisualAnalysis, setAiVisualAnalysis] = useState(null);

    // Stato sezioni AI
    const [showCustomer, setShowCustomer] = useState(false);
    const [showStrengths, setShowStrengths] = useState(false);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [showVisualAnalysis, setShowVisualAnalysis] = useState(false);

    // Stato caricamento AI
    const [aiDescLoading, setAiDescLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    // Gestione errori
    const [error, setError] = useState(null);

    // ===== EFFECTS =====
    // Recupera il prodotto corrente dal database
    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(id);
            setProduct(data);
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    // Resetta stato AI quando cambia prodotto
    useEffect(() => {
        setAiSuggestion(null);
        setAiDescription(null);
        setAiLoading(false);
        setAiDescLoading(false);
        setAiStrengths(null);
        setAiIdealCustomer(null);
        setAiVisualAnalysis(null);
        setShowVisualAnalysis(false);
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

    // ===== RENDER CONDITIONS =====
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

    // ===== FUNCTIONS & HANDLERS =====
    // Avvia l'analisi AI del prodotto
    const handleAIAnalyze = async () => {
        setError(null);
        if (!product) return;

        // evita richieste doppie
        if (aiSuggestion && aiDescription) return;

        setAiLoading(true);
        setAiDescLoading(true);

        try {
            const analysisData = await getAIAnalysis(product);

            const productData = {
                suggested_price: analysisData.suggested_price,
                price_min: analysisData.price_min,
                price_max: analysisData.price_max,
                motivation: analysisData.motivation,
                description: analysisData.description,
                title: analysisData.title,
                market_score: analysisData.market_score,
                strengths: analysisData.strengths,
                ideal_customer: analysisData.ideal_customer,
                visual_analysis: analysisData.visual_analysis,
            };
            await updateProduct(id, productData);
            onProductUpdated();

            setAiSuggestion({
                suggested_price: analysisData.suggested_price,
                price_min: analysisData.price_min,
                price_max: analysisData.price_max,
                motivation: analysisData.motivation,
            });

            setAiDescription(analysisData.description);
            setAiTitle(analysisData.title);
            setAiMarketScore(analysisData.market_score);
            setAiStrengths(analysisData.strengths);
            setAiIdealCustomer(analysisData.ideal_customer);
            setAiVisualAnalysis(analysisData.visual_analysis);

        } catch (error) {
            setError("❌ Impossibile generare l'analisi AI. Riprova tra qualche secondo.");
            console.log(error);
        } finally {
            setAiLoading(false);
            setAiDescLoading(false);
        }
    };

    // Ripristina un'analisi AI già salvata nel database
    const restoreSavedAnalysis = () => {
        if (!product) return;
        if (product.suggested_price) {

            const savedAiSuggestion = {
                suggested_price: product.suggested_price,
                price_min: product.price_min,
                price_max: product.price_max,
                motivation: product.motivation,
            };
            setAiSuggestion(savedAiSuggestion);
            setAiDescription(product.description);
            setAiTitle(product.title);
            setAiMarketScore(product.market_score);
            setAiStrengths(product.strengths);
            setAiIdealCustomer(product.ideal_customer);
            setAiVisualAnalysis(product.visual_analysis);
        }
    };


    return (
        <div className="product-detail">

            {/* ===== IMMAGINE PRODOTTO ===== */}
            <div className="detail-image">
                {product.image_url && (
                    <img
                        className="product-detail-image"
                        src={product.image_url}
                        alt="prodotto"

                        onClick={() => setIsImageOpen(true)}
                    />
                )}
            </div>

            {/* ===== DETTAGLI PRODOTTO + AI ===== */}
            <div className="product-info">
                <button className="back-btn" onClick={() => navigate("/")}>
                    ← Torna indietro
                </button>

                <h1 className="product-title">{product.brand}</h1>

                <p><strong>Categoria:</strong> {product.category}</p>
                <p><strong>Taglia:</strong> {product.size}</p>
                <p><strong>Condizione:</strong> {product.condition}</p>

                <p className="date">
                    Creato il: {new Date(product.created_at).toLocaleString("it-IT")}
                </p>

                {/* Bottone AI */}
                <button
                    onClick={() => {

                        if (product.suggested_price) {

                            restoreSavedAnalysis();

                        } else {

                            handleAIAnalyze();

                        }

                    }}
                    disabled={aiLoading}

                    style={{
                        marginTop: "10px",
                        background: product.suggested_price ? "linear-gradient(135deg, #4338ca, #312e81)" : "linear-gradient(135deg, #6366f1, #4f46e5)",
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
                        : product.suggested_price
                            ? "📄 Visualizza analisi"
                            : "✨ Analizza prodotto"}
                </button>

                {/* Risultati AI */}
                {(aiSuggestion || aiDescription) && (
                    <div
                        className="ai-result-box"
                        style={{
                            marginTop: "20px",
                            padding: "15px",
                            background: product.suggested_price ? "linear-gradient(135deg, #f5f3ff, #ede9fe)" : "linear-gradient(135deg, #fff7ed, #ffedd5)",
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

                        <div className="ai-actions">
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
                                            <>
                                                <p

                                                    style={{
                                                        marginTop: "10px",
                                                        color: "#374151",
                                                        lineHeight: "1.7"
                                                    }}
                                                >
                                                    💰 Prezzo suggerito: {aiSuggestion.suggested_price} €
                                                </p>

                                                <p
                                                    style={{
                                                        color: "#374151",
                                                        lineHeight: "1.7"
                                                    }}
                                                >
                                                    📈 Range: da {aiSuggestion.price_min} € a {aiSuggestion.price_max} €
                                                </p>

                                                <p
                                                    style={{
                                                        color: "#374151",
                                                        lineHeight: "1.7"
                                                    }}
                                                >
                                                    💬 Motivazione: {aiSuggestion.motivation}
                                                </p>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

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

                            <div>
                                {aiVisualAnalysis && (
                                    <>
                                        <button
                                            onClick={() => setShowVisualAnalysis(!showVisualAnalysis)}
                                        >
                                            {showVisualAnalysis ? "▼" : "▶"} 📷 Analisi visiva AI
                                        </button>

                                        {showVisualAnalysis && (
                                            <p
                                                style={{
                                                    marginTop: "10px",
                                                    color: "#374151",
                                                    lineHeight: "1.7"
                                                }}
                                            >
                                                {aiVisualAnalysis}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>

                        </div>

                    </div>

                )}

                {/* Messaggio di errore */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

            </div>

            {/* ===== MODAL IMMAGINE ===== */}
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
















