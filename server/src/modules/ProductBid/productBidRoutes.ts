import express, { Router } from 'express';
import {  getAllProductBids } from './controllers/ProductBidController';
import { authenticateToken } from '../../middlewares/authMiddleware';

const router: Router = express.Router();

// router.post('/product-bid',authenticateToken, createProductBid);
router.get('/product-bid', getAllProductBids);

export default router;