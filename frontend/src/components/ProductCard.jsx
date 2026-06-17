import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, onDelete, onEdit, onCancelEdit, editingProduct, loading, onSelect }) {

    const [loaded, setLoaded] = useState(false);



    console.log("loaded:", loaded);

    const isNew = () => {
        const created = new Date(product.created_at);
        const now = new Date();
        const diff = (now - created) / (1000 * 60 * 60); // ore
        return diff < 24;
    };

    const navigate = useNavigate();
    console.log("ID prodotto:", product.id);

    return (
        <div
            className="product-card"
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(product)}
        >
            {isNew() && <span className="badge-new">NUOVO</span>}

            {/* immagine */}
            {product.image_url && (
                <div className="image-container">

                    {!loaded && <div className="skeleton" />}

                    <img
                        src={product.image_url}
                        alt="prodotto"
                        className={`product-img ${loaded ? "loaded" : ""}`}
                        loading="lazy"
                        onLoad={() => setLoaded(true)}
                        onError={(e) => {
                            const img = e.currentTarget;
                            if (!img.dataset.retried) {
                                img.dataset.retried = "1";
                                img.src = product.image_url + `?t=${Date.now()}`;
                                return;
                            }

                            img.src = "https://via.placeholder.com/300x180?text=No+Image";
                        }}
                    />

                </div>
            )}

            <h3 style={{ margin: "5px 0" }}>{product.brand}</h3>

            <p><strong>Categoria:</strong> {product.category}</p>
            <p><strong>Taglia:</strong> {product.size}</p>
            <p><strong>Condizione:</strong> {product.condition}</p>

            <p style={{ fontSize: "12px", color: "#6b7280" }}>
                Creato il: {new Date(product.created_at).toLocaleString("it-IT")}
            </p>

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();   // 👈 QUESTO È IL FIX
                        onDelete(product.id);
                    }}
                    disabled={loading}
                    style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        flex: 1,
                    }}
                >
                    Elimina
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(product);
                    }}
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        flex: 1,
                    }}
                >
                    Modifica
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation(); // 🔥 fondamentale
                        navigate(`/product/${product.id}`);
                    }}
                    style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        flex: 1,
                    }}
                >
                    Dettagli
                </button>


            </div>

            {editingProduct?.id === product.id && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCancelEdit();
                    }}
                    style={{
                        marginTop: "10px",
                        backgroundColor: "#e5e7eb",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    ❌ Annulla modifica
                </button>
            )}

        </div>
    );
}

export default ProductCard;