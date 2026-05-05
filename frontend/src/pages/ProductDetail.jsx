import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, getAISuggestion, getAIDescription } from "../services/api";
import AIBox from "../components/AIBox";


function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [aiDescription, setAiDescription] = useState(null);
    const [aiDescLoading, setAiDescLoading] = useState(false);

    // Stato del loading
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(id);
            console.log("PRODOTTO:", data); // 👈 debug utile
            setProduct(data);
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        setAiSuggestion(null);
        setAiDescription(null);
        setAiLoading(false);
        setAiDescLoading(false);
    }, [id]);

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

    const isNew = (date) => {
        const created = new Date(date);
        const now = new Date();
        const diff = (now - created) / (1000 * 60 * 60);
        return diff < 24;
    };

    // Funzione AI
    const handleAIAnalyze = async () => {
        if (!product) return;

        // evita richieste doppie
        if (aiSuggestion && aiDescription) return;

        setAiLoading(true);
        setAiDescLoading(true);

        try {
            const [priceData, descData] = await Promise.all([
                getAISuggestion(product),
                getAIDescription(product)
            ]);

            setAiSuggestion(priceData.suggestion);
            setAiDescription(descData.description);

        } catch (error) {
            console.error(error);
            setAiSuggestion("Errore AI");
            setAiDescription("Errore AI");
        } finally {
            setAiLoading(false);
            setAiDescLoading(false);
        }
    };



    return (
        <div className="product-detail">

            {/* COLONNA SINISTRA */}
            <div>
                {product.image_url && (
                    <img
                        src={product.image_url}
                        alt="prodotto"
                        style={{
                            width: "100%",
                            borderRadius: "12px"
                        }}
                    />
                )}
            </div>

            {/* COLONNA DESTRA */}
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


                {(aiSuggestion || aiDescription) && (
                    <div style={{
                        marginTop: "20px",
                        padding: "15px",
                        background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
                        borderRadius: "12px"
                    }}>
                        <strong>🤖 AI Assistant</strong>

                        {aiSuggestion && (
                            <p style={{ marginTop: "10px" }}>
                                💰 {aiSuggestion}
                            </p>
                        )}

                        {aiDescription && (
                            <p style={{ marginTop: "10px" }}>
                                📝 {aiDescription}
                            </p>
                        )}
                    </div>
                )}






            </div>

        </div>
    );
}

export default ProductDetail;