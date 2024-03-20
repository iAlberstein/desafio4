import { Router } from "express";
import ProductManager from "../Managers/ProductManager.js";

const productRouter = Router();
const prod = new ProductManager();

productRouter.post("/", async (req, res) => {
  let newProd = req.body;
  res.send(await prod.addProduct(newProd));
});

productRouter.get("/", async (req, res) => {
  let limit = parseInt(req.query.limit);
  if (!limit) return res.send(await prod.readProduct());
  let allprod = await prod.readProduct();
  let prodLimit = allprod.slice(0, limit);
  res.send(prodLimit);
});

productRouter.get("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(await prod.getProductsById(id));
});

productRouter.put("/:id", async (req, res) => {
  let id = req.params.id;
  let updateProd = req.body;
  res.send(await prod.updateProducts(id, updateProd));
});

productRouter.delete("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(await prod.deleteProducts(id));
});

export default productRouter;