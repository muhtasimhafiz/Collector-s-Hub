import express, { Router } from 'express';
import {  acceptBid, getAllProductBids, getHighestBidsForSeller, getPlacedBids, placeBid } from './controllers/ProductBidController';
import { authenticateToken } from '../../middlewares/authMiddleware';

const router: Router = express.Router();

// router.post('/product-bid',authenticateToken, createProductBid);
router.get('/product-bid', getAllProductBids);
router.post('/product-bid/place-bid/:product_id', authenticateToken, placeBid);
router.get('/product-bid/seller/:user_id', authenticateToken, getHighestBidsForSeller);
router.get('/product-bid/accept-bid/:id', authenticateToken, acceptBid);
router.get('/product-bid/placed-bids/:user_id', authenticateToken, getPlacedBids);

export default router;