import { Router } from "express";
import CartManager from "../Managers/CartManager.js";

const cartRouter = Router();
const cart = new CartManager();

cartRouter.post("/", async (req, res) => {
  res.send(await cart.addCart());
});

cartRouter.get("/", async (req, res) => {
  res.send(await cart.readCart());
});

cartRouter.get("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(await cart.getCartById(id));
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;
    res.send(await cart.addProductCart(cartId, prodId));
})

export default cartRouter;
