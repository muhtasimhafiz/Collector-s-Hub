import ProductBidService from "../ProductBidService";
import { Request, Response } from "express";

export const createProductBid = async (req: Request, res: Response) => {
  try {
    const productBid = await ProductBidService.create(req,req.body);
    return res.status(201).json({ productBid });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllProductBids = async (req: Request, res: Response) => {
  try {
    const productBids = await ProductBidService.findAll(req);
    console.log(productBids);
    return res.status(200).json(productBids);
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

export const getProductBidById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productBid = await ProductBidService.findById(req, Number(id));
  } catch(error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export const updateProductBid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productBid = await ProductBidService.update(req, Number(id), req.body);
    return res.status(200).json(productBid);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export const deleteProductBid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ProductBidService.delete(req, Number(id));
    return res.status(204).send();
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

