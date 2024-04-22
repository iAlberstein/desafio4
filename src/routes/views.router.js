const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-manager-db.js");
const productManager = new ProductManager();

router.get("/chat", async (req, res) => {
   res.render("chat");
});

router.get("/", async (req, res) => {
   res.render("home");
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("realtimeproducts", { productos });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
