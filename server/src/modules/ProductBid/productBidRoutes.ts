import express, { Router } from 'express';
import {  getAllProductBids, placeBid } from './controllers/ProductBidController';
import { authenticateToken } from '../../middlewares/authMiddleware';

const router: Router = express.Router();

// router.post('/product-bid',authenticateToken, createProductBid);
router.get('/product-bid', getAllProductBids);
router.post('/product-bid/place-bid/:product_id', authenticateToken, placeBid);

export default router;