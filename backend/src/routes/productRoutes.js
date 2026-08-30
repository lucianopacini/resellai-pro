const authMiddleware = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

const {
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
} = require("../controllers/productController");

router.get("/", authMiddleware, getProducts);

router.post("/", authMiddleware, createProduct);

router.delete("/:id", authMiddleware, deleteProduct);

router.put("/:id", authMiddleware, updateProduct);

module.exports = router;