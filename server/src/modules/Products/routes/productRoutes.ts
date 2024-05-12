import express, { Router } from 'express';
import { createUserHandler, loginUserHandler, registrationHandle } from '../controllers/productController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { body } from 'express-validator';


const router: Router = express.Router();

//routes input sanitization
const prodcutSanitize = [
  body('name').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('price').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
];
router.post('/product',prodcutSanitize, createProductHandler);

router.get('/product', getProducts);
router.get('/product/:id', getProductById);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);


router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: "You have access to the protected route" });
});

export default router;
