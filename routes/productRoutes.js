// definición de las rutas CRUD para los productos. Este llama a los métodos del controlador.

const express = require('express');
const router = express.Router();

// Importamos los métodos del controlador para las rutas
const {
  showProducts,
  showProductById,
  showNewProduct,
  createProduct,
  showEditProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Rutas para la tienda
router.get('/products', showProducts);
router.get('/products/:productId', showProductById);

// Rutas para el dashboard
router.get('/dashboard', showProducts); // Reutilizamos showProducts
router.get('/dashboard/new', showNewProduct);
router.post('/dashboard', createProduct);
router.get('/dashboard/:productId/edit', showEditProduct);
router.post('/dashboard/:productId', updateProduct); // Usamos POST en lugar de PUT por simplicidad con formularios
router.post('/dashboard/:productId/delete', deleteProduct); // Usamos POST en lugar de DELETE

module.exports = router;

