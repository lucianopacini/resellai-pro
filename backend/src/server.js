const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Backend attivo 🚀");
});

app.listen(PORT, () => {
    console.log(`✅ Server avviato sulla porta ${PORT}`);
}); 