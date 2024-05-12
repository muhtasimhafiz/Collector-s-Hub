import express, { Router } from 'express';
import { createProductCategory, deleteProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory } from '../controllers/ProductCategoryController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { body } from 'express-validator';


const router: Router = express.Router();

//routes input sanitization
const prodcuctCategorySanitize = [
  body('name').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('description').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
];
router.post('/product-category', authenticateToken, createProductCategory  );

router.get('/product-category', getAllProductCategories);
router.get('/product-category/:id', getProductCategoryById);
router.put('/product-category/:id', updateProductCategory);
router.delete('/product-category/:id',authenticateToken, deleteProductCategory);

export default router;
