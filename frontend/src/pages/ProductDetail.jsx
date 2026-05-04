import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/api";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(id);
            console.log("PRODOTTO:", data); // 👈 debug utile
            setProduct(data);
            setLoading(false);
        };

        fetchProduct();
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
            </div>

        </div>
    );
}

export default ProductDetail;