function ProductForm({
    handleSubmit,
    handleImageChange,
    preview,
    formData,
    handleChange,
    editingProduct,
    handleCancelEdit,
    loading,
    fileInputRef,
    firstInputRef
}) {
    return (
        <form
            onSubmit={handleSubmit}
            style={{
                border: editingProduct ? "2px solid orange" : "1px solid #ccc",
                backgroundColor: editingProduct ? "#fff7ed" : "white",
                padding: "15px",
                borderRadius: "10px",
                transition: "0.3s",
            }}
        >
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
            />

            {preview && (
                <img
                    src={preview}
                    alt="preview"
                    style={{ width: "150px", marginTop: "10px" }}
                />
            )}

            <input
                type="text"
                name="category"
                placeholder="Categoria"
                value={formData.category}
                onChange={handleChange}
                ref={firstInputRef}
            />

            <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
            />

            <input
                type="text"
                name="size"
                placeholder="Taglia"
                value={formData.size}
                onChange={handleChange}
            />

            <input
                type="text"
                name="condition"
                placeholder="Condizione"
                value={formData.condition}
                onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
                {loading
                    ? "⏳ Salvataggio..."
                    : editingProduct
                        ? "✏️ Salva modifiche"
                        : "➕ Salva prodotto"}
            </button>

            {editingProduct && (
                <button type="button" onClick={handleCancelEdit}>
                    Annulla modifica
                </button>
            )}
        </form>
    );
}

export default ProductForm;