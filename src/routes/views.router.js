import express from 'express';
import ProductManager from '../public/js/ProductManager.js';


const router = express.Router();
const productManager = new ProductManager("./src/data/products.json");

router.get('/', (req,res) => {
  const products = productManager.getProducts();
  res.render('realTimeProducts', {products});
})

export default router;