import { Request, Response } from 'express';
import VideoService from './VideoService';
import { User } from '../Users/models/User';
import { Product } from '../Products/models/Product';


class VideoController {
  async getAllVideos(req: Request, res: Response) {
    try {
      const videos = await VideoService.findAll(req,
        {
          where: req.query,
          include: [
            {
              model: User,
              as: 'user'
            },
            {
              model: Product,
              as: 'product',
              required: false,
            }
          ]
        } 
        
      );
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getVideoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const video = await VideoService.findById(req,Number(id));
      if (!video) {
        res.status(404).json({ error: 'Video not found' });
      } else {
        res.json(video);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createVideo(req: Request, res: Response) {
    try {
      const newVideo = await VideoService.create(req,req.body);
      res.status(201).json(newVideo);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // async updateVideo(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     const { title, description } = req.body;
  //     const updatedVideo = await videoService.updateVideo(id, title, description);
  //     if (!updatedVideo) {
  //       res.status(404).json({ error: 'Video not found' });
  //     } else {
  //       res.json(updatedVideo);
  //     }
  //   } catch (error) {
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // }

  async deleteVideo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedVideo = await VideoService.delete(req,Number(id));
      if (!deletedVideo) {
        res.status(404).json({ error: 'Video not found' });
      } else {
        res.json({ message: 'Video deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new VideoController();