import { Router } from "express";
import ProductManager from "../public/js/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get('/', async (req, res) => {
    try {
      const { limit } = req.query;
      const products = await productManager.getProducts();
  
      if(limit) {
        const limitedProducts = products.slice(0, parseInt(limit));
        res.render('home', {limitedProducts} );
      } else {
        res.render('home', {products}); 
      }
    } catch (error) {
      res.status(200).json({ error: "Error al obtener los productos"});
    }
  })
  
router.get('/:pid', async (req, res) => {
      try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
  
        if(product) res.json(product);
        else res.status(404).json({error: "Producto no Encontrado"});
  
      } catch (error) {
        res.status(200).json({error: "Error al obtener el producto"});
      }
  }) 

  router.put('/:pid', (req,res) => {
    const productId = req.params.pid;
    console.log(productId)
    const result = productManager.updateProduct(parseInt(productId), req.body)
    return res.json({ result })
  })

  router.delete('/:pid', async (req,res) => {
    try {
      const productId = req.params.pid;
      const result = await productManager.deleteProduct(parseInt(productId));
      return res.json({ result })
    } catch (error) {
      res.status(200).json({error: "No se pudo eliminar el producto"})
    }
    
  })

export default router;