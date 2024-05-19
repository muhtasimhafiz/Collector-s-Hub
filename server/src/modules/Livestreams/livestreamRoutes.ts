import express, { Router } from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware';
import { getLivestreams } from './controllers/LiveStreamController';


const router: Router = express.Router();

router.get('/livestream',getLivestreams)
router.get('/livestream/:id', getLivestreams)
router.post('/livestream', authenticateToken, getLivestreams)
router.put('/livestream/:id', authenticateToken, getLivestreams)
router.delete('/livestream/:id', authenticateToken, getLivestreams)


export default router;