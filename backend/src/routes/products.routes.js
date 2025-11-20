import express from 'express';
import ProductController from '../controllers/products.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas públicas (sin autenticación)
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

// Rutas protegidas (requieren autenticación)
router.post('/create', authMiddleware, ProductController.createProduct);
router.put('/:id', authMiddleware, ProductController.updateProduct);
router.delete('/:id', authMiddleware, ProductController.deleteProduct);

export default router;