import express, { Router } from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/ProductController';
import { createProductReview } from '../controllers/ProductReviewController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { body } from 'express-validator';


const router: Router = express.Router();

//routes input sanitization
router.post('/product', authenticateToken, createProduct);

router.get('/product', getProducts);
router.get('/product/:id', getProductById);
router.put('/product/:id',authenticateToken, updateProduct);
router.delete('/product/:id',authenticateToken, deleteProduct);

//product reviews
router.post('/product/reviews', authenticateToken, createProductReview);




export default router;
