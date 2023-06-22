import { readFileSync, writeFileSync } from 'fs';

class ProductManager {

    #path

    constructor(path) {
        this.#path = path;
        this.products = [];
        this.idProduct = 1;
    }

    addProduct(title,description,price,thumbnail,code,stock) {
   
        const product = {
        id: this.idProduct++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      }

      this.products.push(product);
      console.log("Producto", product.id, "Agregado")
      this.saveProducts();
    }

    getProducts() {
      try {
        const data = readFileSync(this.#path, 'utf-8');
        const products = JSON.parse(data);
        this.products = products;
        return products;
      } catch (error) {
        console.log("Error al leer el archivo de productos", error);
        return [];
      }
    }
    getProductById(id) {
      const productos = this.getProducts();
      const productoEncontrado = productos.find(p => String(p.id) === id);
      if (productoEncontrado) {
        return productoEncontrado;
      } else {
        return false;
      }
    }

    updateProduct(id, camposActualizar) {
      const productos = this.getProducts();
      const index = productos.findIndex((p) => p.id === id);

      if(index !== -1) {
        const updateProduct = {...productos[index], ...camposActualizar};
        productos[index] = updateProduct;
        this.saveProducts(productos);
        return updateProduct;
      }
    }

    deleteProduct(id){
      const productos = this.getProducts();
      const index = productos.findIndex((p) => p.id === id);

      if(index !== -1) {
        const deletedProduct = productos.splice(index,1)[0];
        this.saveProducts(productos);
        console.log("Producto", id, "Eliminado");
        return deletedProduct;
      } else {
        console.log("No existe el producto a eliminar");
      }
    }
    
    
    saveProducts(products) {
        writeFileSync(this.#path, JSON.stringify(this.products), 'utf-8');
        console.log('productos guardados en el archivo');
    }

}

export default ProductManager;