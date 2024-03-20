import { promises as fs } from "fs";
import ProductManager from "./ProductManager.js";

class CartManager {
  constructor() {
    this.path = "./src/models/carts.json";
    this.productManager = new ProductManager();
  }

  readCart = async () => {
    let carts = await fs.readFile(this.path, "utf-8");
    return JSON.parse(carts);
  };

  writeCart = async (carts) => {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  };

  cartExist = async (id) => {
    let carts = await this.readCart();
    return carts.find((cart) => cart.id === parseInt(id));
  };

  addCart = async () => {
    let allCarts = await this.readCart();
    let newId = await this.getNextId(); 
    let cart = { id: newId, products: [] };
    let carts = [cart, ...allCarts];
    await this.writeCart(carts);
    return "Carrito agregado exitosamente";
  };

  getNextId = async () => {
    let carts = await this.readCart();
    if (carts.length === 0) {
      return 1; 
    } else {
      let maxId = Math.max(...carts.map(cart => cart.id));
      return maxId + 1;
    }
  };

  getCartById = async (id) => {
    let cartID = await this.cartExist(id);
    if (!cartID) return "Carrito no encontrado";
    return cartID;
  };

  addProductCart = async (cartId, prodId) => {
    let cartById = await this.cartExist(cartId);
    if (!cartById) return "Carrito no encontrado";
    let productById = await this.productManager.productExist(parseInt(prodId));
    if (!productById) return "Producto no encontrado";
    let carts = await this.readCart();
    let cartF = carts.filter((cart) => cart.id != parseInt(cartId));

    if (cartById.products.some((prod => prod.id === parseInt(prodId)))) {
      let AddproductInCart = cartById.products.find((prod) => prod.id === parseInt(prodId));
      AddproductInCart.quantity++;
      let cartAdd = [cartById, ...cartF];
      await this.writeCart(cartAdd);
      return "Producto agregado nuevamente al carrito";
    }
    cartById.products.push({ id: parseInt(productById.id), quantity: 1 })
    let cartAdd = [cartById, ...cartF];
    await this.writeCart(cartAdd);
    return "Producto agregado al carrito";
  };
}

export default CartManager;
