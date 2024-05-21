import ProductBidService from "../ProductBidService";
import { Request, Response } from "express";
import { ProductBid } from "../models/ProductBid";
import { Product } from "../../Products/models/Product";
import { IProduct } from "../../Products/interfaces/IProduct";
import { IProductBid } from "../types";

export const createProductBid = async (req: Request, res: Response) => {
  try {
    const productBid = await ProductBidService.create(req, req.body);
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
  } catch (error: any) {
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

export const placeBid = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;
    // find the highest bid for the product thats still pending
    const product = await Product.findByPk(product_id);
    if (!product || product.bidding === false) return res.status(400).json({ message: 'Bidding is closed for this product' });
    const highestBid = await ProductBid.findOne({
      where: {
        status: 'pending',
        id: product_id
      },
      order: [
        ['bid_price', 'DESC']
      ],
      // include: [
      //   {
      //     model: Product,
      //     as: 'product',
      //   }
      // ]
    });

    let user_id = null;
    if (req && (req as any).user) {
      user_id = (req as any).user.id;
    }
    if (!user_id) throw new Error('User not found');

    if (highestBid &&
      req.body.bid_price < highestBid.bid_price) {
      return res.status(400).json({ message: 'Bid price must be greater than the highest bid' });
    }

    const existingProductBid = await ProductBid.findOne({
      where: {
        user_id,
        product_id: Number(product_id),
        status: 'pending'
      }
    });

    if (existingProductBid) {
      existingProductBid.bid_price = req.body.bid_price;
      await existingProductBid.save();
      return res.status(201).json({ existingProductBid });
    }
    const productBid = await ProductBidService.create(req,
      {
        user_id: user_id,
        status: 'pending',
        ...req.body,
        product_id: Number(product_id)
      });
    return res.status(201).json(productBid);
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: "error placing bids" });
  }
}

export const getHighestBidsByUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    console.log(user_id);
    const highestBids = await ProductBidService.findHighestBidsBySeller(req, Number(user_id));
    return res.status(200).json(highestBids);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export const acceptBid = async (req: Request, res: Response) => {
  console.log("accept bid");
  try {
    const { id } = req.params;
    const productBid = await ProductBidService.acceptBid(req, Number(id));
    return res.status(200).json(productBid);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}
