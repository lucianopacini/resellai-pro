// ===== IMPORT =====
import { useEffect, useState, useRef, useMemo } from "react";
import "./App.css";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  uploadImage,
} from "./services/api";
import { supabase } from "./services/supabaseClient";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProductDetail from "./pages/ProductDetail";
import { isNew, } from "./utils/dateUtils";

function App() {

  // ===== STATE =====

  // Auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);

  // Form prodotto
  const [formData, setFormData] = useState({
    category: "",
    brand: "",
    size: "",
    condition: "",
  });

  // Prodotti
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // UI
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Filtri e ordinamento
  const [searchTerm, setSearchTerm] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Immagine
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // ===== REF =====
  const firstInputRef = useRef(null);
  const fileInputRef = useRef(null);


  // ===== FUNZIONI =====

  // Form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validazione campi obbligatori
    if (
      !formData.category ||
      !formData.brand ||
      !formData.size ||
      !formData.condition ||
      (!editingProduct && !image)
    ) {
      alert("Compila tutti i campi del prodotto e carica un'immagine");
      return;
    }
    // Verifica autenticazione
    if (!loggedUser) {
      alert("Devi fare login prima di salvare un prodotto");
      return;
    }
    // Upload immagine
    let imageUrl = editingProduct?.image_url || "";

    if (image) {
      imageUrl = await uploadImage(image);

      if (!imageUrl) {
        alert("Errore durante il caricamento dell'immagine");
        return;
      }
    }
    // Prepara i dati del prodotto
    const productData = {
      ...formData,
      image_url: imageUrl,
      suggested_price: 0,
      price_min: 0,
      price_max: 0,
      motivation: "",
      description: "",
      title: "",
      market_score: "",
      strengths: "",
      ideal_customer: "",
      visual_analysis: "",
      user_id: loggedUser?.id || null,
    };

    let result;
    // Crea o aggiorna il prodotto
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      result = await createProduct(productData);
    }
    // Mostra messaggio di conferma
    setSuccessMessage(result.message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
    // Aggiorna la lista prodotti
    await fetchProducts();

    // Reset del form
    setFormData({
      category: "",
      brand: "",
      size: "",
      condition: "",
    });

    setImage(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setImage(null);
    setPreview("");

    setFormData({
      category: "",
      brand: "",
      size: "",
      condition: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Sei sicuro di voler eliminare questo prodotto?"
    );

    if (!confirmDelete) return;

    await deleteProduct(id);
    await fetchProducts();
  };

  // Auth
  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return console.log(error.message);
    alert("Registrazione completata!");
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Errore login:", error);
      alert(error.message);
      return;
    }

    setLoggedUser(data.user);
    await fetchProducts();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLoggedUser(null);
    setProducts([]);
    setEmail("");
    setPassword("");
  };

  // Recupera tutti i prodotti dal backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ===== EFFECT =====
  // Carica i prodotti all'avvio dell'app
  useEffect(() => {
    if (loggedUser) {
      fetchProducts();
    }
  }, [loggedUser]);

  // Ripristina la sessione utente se già autenticato
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setLoggedUser(data.user);
    };

    getUser();
  }, []);

  // Popola il form durante la modifica di un prodotto
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        category: editingProduct.category,
        brand: editingProduct.brand,
        size: editingProduct.size,
        condition: editingProduct.condition,
      });

      firstInputRef.current?.focus();
    }
  }, [editingProduct]);


  // Gestione del modal
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedProduct]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    // Chiude il modal con il tasto ESC
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ===== FILTRAGGIO E ORDINAMENTO PRODOTTI =====
  const filteredProducts = useMemo(() => {
    let result = products
      .filter((product) => product.user_id === loggedUser?.id)
      .filter((product) =>
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((product) =>
        product.category.toLowerCase().includes(categorySearch.toLowerCase())
      );

    if (sortBy === "newest") {
      result.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }

    if (sortBy === "oldest") {
      result.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    }

    if (sortBy === "brand-asc") {
      result.sort(
        (a, b) => a.brand.localeCompare(b.brand)
      );
    }

    if (sortBy === "brand-desc") {
      result.sort(
        (a, b) => b.brand.localeCompare(a.brand)
      );
    }

    return result;
  }, [
    products,
    loggedUser,
    searchTerm,
    categorySearch,
    sortBy,
  ]);

  // ===== DATI DERIVATI E STATISTICHE =====
  const totalProducts = filteredProducts.length;
  const uniqueBrands = new Set(
    filteredProducts.map(
      (product) => product.brand
    )
  );
  const totalBrands = uniqueBrands.size;

  const uniqueCategories = new Set(
    filteredProducts.map(
      (product) => product.category
    )
  );
  const totalCategories = uniqueCategories.size;

  const newProducts = filteredProducts.filter(
    (product) => isNew(product.created_at)
  );
  const totalNewProducts = newProducts.length;

  const totalInventoryValue = filteredProducts.reduce(
    (total, product) => {
      return total + product.suggested_price;
    },
    0
  );


  return (
    <>
      <div className="app-container">

        {/* ===== HEADER ===== */}
        <h1>ResellAI Pro</h1>

        <p className="tagline"> Il tuo assistente AI per il reselling</p>

        <div className="user-card">
          {loggedUser ? (
            <div className="user-info">
              👤 Benvenuto, <span className="username">{loggedUser.email}</span>
              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <p>🔒 Accedi o registrati per iniziare.</p>
          )}
        </div>

        <Routes>

          <Route
            path="/"
            element={
              <div className="page-content">

                {/* ===== AUTH SECTION ===== */}
                {!loggedUser && (

                  <div className="auth-section">
                    <div>
                      <h2>Registrazione</h2>

                      <div className="auth-row">

                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                          className="password-btn"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>

                        <button onClick={handleSignup}>Registrati</button>
                        <button onClick={handleLogin}>Accedi</button>

                      </div>
                    </div>
                  </div>

                )}

                {/* ===== AREA RISERVATA ===== */}
                {loggedUser && (
                  <>
                    <p className="subtitle">
                      {editingProduct
                        ? "Aggiorna i dati del prodotto selezionato"
                        : "Compila il form per aggiungere un nuovo prodotto"}
                    </p>

                    {!editingProduct && (
                      <p className="upload-tip">
                        📸 Per risultati migliori usa foto verticali e ben illuminate.
                      </p>
                    )}
                  </>
                )}

                {loading && <p>🔄 Aggiornamento prodotti...</p>}

                {/* ===== FORM PRODOTTO ===== */}
                {loggedUser && (
                  <ProductForm
                    handleSubmit={handleSubmit}
                    handleImageChange={handleImageChange}
                    preview={preview}
                    formData={formData}
                    handleChange={handleChange}
                    editingProduct={editingProduct}
                    handleCancelEdit={handleCancelEdit}
                    loading={loading}
                    fileInputRef={fileInputRef}
                    firstInputRef={firstInputRef}
                  />

                )}

                {/* ===== FEEDBACK ===== */}
                {successMessage && <p>{successMessage}</p>}

                {/* ===== FILTRI =====*/}
                {loggedUser && (
                  <>
                    <h2>
                      Prodotti salvati ({filteredProducts.length})
                    </h2>

                    <div className="filters">
                      <input
                        className="search-input"
                        type="text"
                        placeholder="Cerca per brand"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />

                      <input
                        className="search-input"
                        type="text"
                        placeholder="Cerca per categoria"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                      />

                      <select
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="newest">Più recenti</option>
                        <option value="oldest">Più vecchi</option>
                        <option value="brand-asc">Brand A-Z</option>
                        <option value="brand-desc">Brand Z-A</option>
                      </select>
                    </div>

                    {/* ===== DASHBOARD STATISTICHE ===== */}
                    <div className="stats-wrapper">
                      <h3 className="dashboard-title">📊 Dashboard</h3>
                      <div className="stats-box">

                        <div className="stat-card">
                          📦
                          <span className="stat-number">
                            {totalProducts}
                          </span>
                          Prodotti
                        </div>

                        <div className="stat-card">
                          🏷️
                          <span className="stat-number">
                            {totalBrands}
                          </span>
                          Brand
                        </div>

                        <div className="stat-card">
                          📂
                          <span className="stat-number">
                            {totalCategories}
                          </span>
                          Categorie
                        </div>

                        <div className="stat-card">
                          ⭐
                          <span className="stat-number">
                            {totalNewProducts}
                          </span>
                          New
                        </div>

                        <div className="stat-card">
                          💰
                          <span className="stat-number">
                            {totalInventoryValue}
                          </span>
                          Valore inventario
                        </div>

                      </div>
                    </div>

                  </>
                )}

                {/* ===== LISTA PRODOTTI ===== */}
                {loggedUser && (
                  <ProductList
                    products={filteredProducts}
                    onDelete={handleDeleteProduct}
                    onEdit={(product) => {
                      setEditingProduct(product);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onCancelEdit={handleCancelEdit}
                    editingProduct={editingProduct}
                    loading={loading}
                    onSelect={(product) => setSelectedProduct(product)}
                  />
                )
                }

                {/* ===== MODAL PRODOTTO ===== */}
                {selectedProduct && (
                  <div
                    className={`modal-overlay open`}
                    onClick={() => setSelectedProduct(null)}
                  >
                    <div
                      className={`modal open`}
                      onClick={(e) => e.stopPropagation()}
                    >

                      <img
                        src={selectedProduct.image_url}
                        alt="prodotto"
                        className="modal-img"
                      />

                      <h2>{selectedProduct.brand}</h2>
                      <p><strong>Categoria:</strong> {selectedProduct.category}</p>
                      <p><strong>Taglia:</strong> {selectedProduct.size}</p>
                      <p><strong>Condizione:</strong> {selectedProduct.condition}</p>

                      <button onClick={() => setSelectedProduct(null)}>
                        Chiudi
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProduct(null);
                          navigate(`/product/${selectedProduct.id}`);
                        }}
                      >
                        Vai alla pagina →
                      </button>

                    </div>
                  </div>
                )
                }

              </div >
            }
          />

          {/* ===== ROUTE DETTAGLIO PRODOTTO ===== */}
          <Route
            path="/product/:id"
            element={
              <ProductDetail
                onProductUpdated={fetchProducts}
              />
            }
          />

        </Routes >

        {/* ===== FOOTER ===== */}

        <footer className="footer">

          <p>© 2026 ResellAI Pro</p>
          <p>Developed by Luciano Pacini</p>
          <p>Powered by React • Node.js • Supabase • OpenAI</p>


        </footer>
      </div>

    </>

  );

}

export default App;
