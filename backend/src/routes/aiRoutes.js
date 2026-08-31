const authMiddleware = require("../middleware/authMiddleware");

const express = require("express");

const router = express.Router();

const { analyzeProduct } = require("../controllers/aiController");

router.post(
    "/analyze-product",
    authMiddleware,
    analyzeProduct
);


module.exports = router;






