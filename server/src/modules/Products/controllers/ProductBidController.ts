import ProductBidService from "../services/ProductBidService";
import { Request, Response } from "express";

export const createProductBid = async (req: Request, res: Response): Promise<void> => {
  try {
    const productBidService = new ProductBidService();
    const newBid = await productBidService.createProductBid(req, req.body);
    res.status(201).json(newBid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getAllProductBids = async (req: Request, res: Response): Promise<void> => {
  try {
    const productBidService = new ProductBidService();
    const bids = await productBidService.getAllProductBids();
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getProductBidById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productBidService = new ProductBidService();
    const bid = await productBidService.getProductBidById(Number(req.params.id));
    res.status(200).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const updateProductBid = async (req: Request, res: Response): Promise<void> => {
  try {
    const productBidService = new ProductBidService();
    const bid = await productBidService.updateProductBid(Number(req.params.id), req.body);
    res.status(200).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}