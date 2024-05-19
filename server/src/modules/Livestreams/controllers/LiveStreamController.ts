
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

export const deleteLivestream = async (req: Request, res: Response) => {
  try {
    const deleted = await LivestreamService.deleteLivestream(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: 'Livestream not found' });
    }
    res.status(200).json({ message: 'Livestream deleted' });
  } catch (error:any) {
    console.log(error.message);
    res.status(500).json({ message: 'Error deleting livestream' });
  }
}

export const findOrCreateLivestream = async (req: Request, res: Response) => {
  try {
    const livestream = await LivestreamService.findOrCreate(req.body, req.body);
    if (!livestream) {
      return createLivestream(req, res);
    }
    res.status(200).json(livestream);
  } catch (error:any) {
    console.log(error.message);
    res.status(500).json({ message: 'Error finding or creating livestream' });
  }
}

export const updateWhereLivestream = async (req: Request, res: Response) => {
  try {
    const livestreams = await LivestreamService.updateWhere(req.query, req.body);
    res.status(200).json(livestreams);
  } catch (error:any) {
    console.log(error.message);
    res.status(500).json({ message: 'Error updating livestreams' });
  }
}