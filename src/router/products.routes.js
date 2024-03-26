import { Router } from "express";
import ProductManager from "../Managers/ProductManager.js";

const productRouter = Router();
const prod = new ProductManager();

productRouter.post("/", async (req, res) => {
  try {
    let newProd = req.body;
    const respuesta = await prod.addProduct(newProd);
    if (respuesta.status) {
      return res.status(201).json({ status: true, msg: `Producto agregado correctamente con id ${respuesta.msg}` });
    } else {
      return res.status(400).json({ status: false, msg: respuesta.msg });
    }
  } catch (error) {
    console.error("Error al agregar producto:", error);
    return res.status(500).json({ status: false, msg: "Error interno del servidor" });
  }
});

productRouter.get("/", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit);
    if (!limit) {
      return res.send(await prod.readProduct());
    } else {
      let allprod = await prod.readProduct();
      let prodLimit = allprod.slice(0, limit);
      return res.send(prodLimit);
    }
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res.status(500).json({ status: false, msg: "Error interno del servidor" });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const product = await prod.getProductsById(id);
    if (typeof product === 'string') {
      return res.status(404).json({ status: false, msg: product });
    } else {
      return res.send(product);
    }
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    return res.status(500).json({ status: false, msg: "Error interno del servidor" });
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let updateProd = req.body;
    const respuesta = await prod.updateProducts(id, updateProd);
    if (respuesta === "Producto actualizado exitosamente") {
      return res.status(200).json({ status: true, msg: respuesta });
    } else {
      return res.status(404).json({ status: false, msg: respuesta });
    }
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return res.status(500).json({ status: false, msg: "Error interno del servidor" });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const respuesta = await prod.deleteProducts(id);
    if (respuesta === "Producto eliminado") {
      return res.status(200).json({ status: true, msg: respuesta });
    } else {
      return res.status(404).json({ status: false, msg: respuesta });
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res.status(500).json({ status: false, msg: "Error interno del servidor" });
  }
});

export default productRouter;
