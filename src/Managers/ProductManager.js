import { promises as fs } from "fs";

class ProductManager {
  static id = 0;

  constructor() {
    this.path = "./src/models/products.json";
    this.products = [];
  }

  readProduct = async () => {
    let products = await fs.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };

  writeProduct = async (product) => {
    await fs.writeFile(this.path, JSON.stringify(product));
  };

  productExist = async (id) => {
    let products = await this.readProduct();
    return products.find((prod) => prod.id === id);
  };
  

  addProduct = async (Product) => {
    const { id, title, description, price, thumbnail, stock, category } = Product;
    if (!id || !title || !description || price == null || thumbnail == null || stock == null || !category) {
      return "Todos los campos son obligatorios";
    }

    const existingProduct = await this.productExist(id);
    if (existingProduct) {
      return `El producto con el id # ${id} ya se encuentra registrado`;
    }

    this.products = await this.readProduct();
    this.products.push(Product);
    await this.writeProduct(this.products);
    return Product;
  };

  getProducts = async () => {
    const read = await fs.readFile(this.path, "utf-8");
    const readJson = JSON.parse(read);
    return readJson;
  }

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
      return "Error al obtener el producto por ID";
    }
  };
  
  
  

  updateProducts = async (id, updatedFields) => {
    let products = await this.readProduct();
    let index = products.findIndex((prod) => prod.id === parseInt(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedFields }; // Actualizar solo los campos proporcionados en updatedFields
      await this.writeProduct(products);
      return "Producto actualizado exitosamente";
    } else {
      return "Producto no encontrado";
    }
  };
  
  

  deleteProducts = async (id) => {
    let products = await this.readProduct();
    let exist = products.some((prod) => prod.id === parseInt(id));
    if (exist) {
        let ProdID = products.filter((prod) => prod.id !== parseInt(id));
        await this.writeProduct(ProdID);
        return "Producto eliminado";
    } else {
        return "El producto no existe";
    }
};

}

export default ProductManager;