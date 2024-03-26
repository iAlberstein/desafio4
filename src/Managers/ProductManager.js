import { promises as fs } from "fs";

class ProductManager {
  static id = 0;

  constructor() {
    this.path = "./src/models/products.json";
    this.products = [];
  }

  readProduct = async () => {
    try {
      let products = await fs.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      console.error("Error al leer productos:", error);
      throw new Error("Error al leer productos");
    }
  };

  writeProduct = async (product) => {
    try {
      await fs.writeFile(this.path, JSON.stringify(product, null, 2));
    } catch (error) {
      console.error("Error al escribir producto:", error);
      throw new Error("Error al escribir producto");
    }
  };

  productExist = async (id) => {
    let products = await this.readProduct();
    return products.find((prod) => prod.id === id);
  };

  addProduct = async (Product) => {
    try {
      const { id, title, description, price, thumbnail, stock, category } = Product;
      if (!id || !title || !description || price == null || thumbnail == null || stock == null || !category) {
        return { status: false, msg: "Todos los campos son obligatorios" };
      }

      const existingProduct = await this.productExist(id);
      if (existingProduct) {
        return { status: false, msg: `El producto con el id # ${id} ya se encuentra registrado` };
      }

      this.products = await this.readProduct();
      this.products.push(Product);
      await this.writeProduct(this.products);
      return { status: true, msg: Product.id };
    } catch (error) {
      console.error("Error al agregar producto:", error);
      throw new Error("Error al agregar producto");
    }
  };

  getProductsById = async (id) => {
    try {
      const read = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(read);
      const product = products.find((prod) => prod.id === parseInt(id));
      if (product) {
        return product;
      } else {
        return "Producto no encontrado";
      }
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
      throw new Error("Error al obtener el producto por ID");
    }
  };

  updateProducts = async (id, updatedFields) => {
    try {
      let products = await this.readProduct();
      let index = products.findIndex((prod) => prod.id === parseInt(id));
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedFields };
        await this.writeProduct(products);
        return "Producto actualizado exitosamente";
      } else {
        return "Producto no encontrado";
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw new Error("Error al actualizar producto");
    }
  };

  deleteProducts = async (id) => {
    try {
      let products = await this.readProduct();
      let exist = products.some((prod) => prod.id === parseInt(id));
      if (exist) {
        let ProdID = products.filter((prod) => prod.id !== parseInt(id));
        await this.writeProduct(ProdID);
        return "Producto eliminado";
      } else {
        return "El producto no existe";
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw new Error("Error al eliminar producto");
    }
  };

}

export default ProductManager;
