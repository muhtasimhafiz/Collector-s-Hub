import express, { Router } from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { body } from 'express-validator';


const router: Router = express.Router();

//routes input sanitization
router.post('/product', authenticateToken, createProduct);

router.get('/product', getProducts);
router.get('/product/:id', getProductById);
router.put('/product/:id',authenticateToken, updateProduct);
router.delete('/product/:id',authenticateToken, deleteProduct);


router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: "You have access to the protected route" });
});

export default router;
