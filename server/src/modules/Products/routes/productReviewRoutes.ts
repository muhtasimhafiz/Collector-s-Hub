import { Router } from "express";
import { authenticateToken } from "../../../middlewares/authMiddleware";
import { body } from "express-validator";
import { createProductReview } from "../controllers/ProductReviewController";

const router: Router = Router();

router.post('/product-review', authenticateToken, createProductReview);
router.get('/product-review', );