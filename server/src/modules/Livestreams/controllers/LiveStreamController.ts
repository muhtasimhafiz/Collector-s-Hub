
import { Request, Response } from 'express';
import LivestreamService from '../services/LiveStreamService';
import exp from 'constants';

export const getLivestreams = async (req: Request, res: Response) => {
  try {
    const livestreams = await LivestreamService.getAllLivestreams(req.query);
    res.status(200).json(livestreams);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving livestreams' });
  }
}


export const getLivestreamById = async (req: Request, res: Response) => {
  try {
    const livestream = await LivestreamService.getLivestreamById(Number(req.params.id));
    if (!livestream) {
      return res.status(404).json({ message: 'Livestream not found' });
    }
    res.status(200).json(livestream);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving livestream' });
  }
}

export const createLivestream = async (req: Request, res: Response) => {
  try {
    const livestream = await LivestreamService.createLivestream(req, req.body);
    res.status(201).json(livestream);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating livestream' });
  }
}

export const updateLivestream = async (req: Request, res: Response) => {
  try {
    const livestream = await LivestreamService.updateLivestream(req, Number(req.params.id), req.body);
    if (!livestream) {
      return res.status(404).json({ message: 'Livestream not found' });
    }
    res.status(200).json(livestream);
  } catch (error:any) {
    console.log(error.message);
    res.status(500).json({ message: 'Error updating livestream' });
  }
}