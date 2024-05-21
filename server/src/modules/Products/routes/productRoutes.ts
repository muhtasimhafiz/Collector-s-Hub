import express, { Router } from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/ProductController';
import { createProductReview } from '../controllers/ProductReviewController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { body } from 'express-validator';
import { BuyItems, getItemsSold, getTransactionsByUser } from '../controllers/ItesmSoldController';


const router: Router = express.Router();

//routes input sanitization
router.post('/product', authenticateToken, createProduct);

router.get('/product', getProducts);
router.get('/product/:id', getProductById);
router.put('/product/:id',authenticateToken, updateProduct);
router.delete('/product/:id',authenticateToken, deleteProduct);

router.post('/buy-now', authenticateToken, BuyItems);
router.get('/product/items-sold', authenticateToken, getItemsSold);
router.get('/product/items-sold/transaction/:user_id', authenticateToken, getTransactionsByUser);

//product reviews
router.post('/product/reviews', authenticateToken, createProductReview);




export default router;
