import express, { Router } from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware';
import VideoController from './VideoController';

const router: Router = express.Router();

router.get('/videos', VideoController.getAllVideos);
router.get('/videos/:id', VideoController.getVideoById);
router.post('/videos', authenticateToken, VideoController.createVideo);
// router.put('/videos/:id', authenticateToken, VideoController.updateVideo);
// router.delete('/videos/:id', authenticateToken, VideoController.deleteVideo);


export default router;