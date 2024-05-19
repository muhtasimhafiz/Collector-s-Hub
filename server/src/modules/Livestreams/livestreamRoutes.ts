import express, { Router } from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware';
import { createLivestream, getLivestreams, updateLivestream, updateWhereLivestream } from './controllers/LiveStreamController';
import { create } from 'domain';


const router: Router = express.Router();

router.get('/livestream',getLivestreams)
router.get('/livestream/:id', getLivestreams)
router.post('/livestream', authenticateToken, createLivestream)
router.put('/livestream/:id', authenticateToken, updateLivestream)
router.put('/livestream-conditions', authenticateToken, updateWhereLivestream)
router.delete('/livestream/:id', authenticateToken, getLivestreams)



export default router;