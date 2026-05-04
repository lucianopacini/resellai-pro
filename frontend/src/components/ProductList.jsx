import ProductCard from "./ProductCard";

function ProductList({
    products,
    onDelete,
    onEdit,
    onCancelEdit,
    editingProduct,
    loading,
    onSelect   // 👈 DEVE ESSERCI
}) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px",
                marginTop: "20px"
            }}
        >
            {products.length === 0 ? (
                <p>Nessun prodotto salvato</p>
            ) : (
                products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onCancelEdit={onCancelEdit}
                        editingProduct={editingProduct}
                        loading={loading}
                        onSelect={onSelect}   // 👈 QUESTO 

                    />
                ))
            )}
        </div>
    );
}

export default ProductList;