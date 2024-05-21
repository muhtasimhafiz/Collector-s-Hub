import express, { Router } from 'express';
import {  acceptBid, getAllProductBids, getHighestBidsByUser, placeBid } from './controllers/ProductBidController';
import { authenticateToken } from '../../middlewares/authMiddleware';

const router: Router = express.Router();

// router.post('/product-bid',authenticateToken, createProductBid);
router.get('/product-bid', getAllProductBids);
router.post('/product-bid/place-bid/:product_id', authenticateToken, placeBid);
router.get('/product-bid/seller/:user_id', authenticateToken, getHighestBidsByUser);
router.get('/product-bid/accept-bid/:id', authenticateToken, acceptBid);

export default router;