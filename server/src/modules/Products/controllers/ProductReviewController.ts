import ProductReviewService from "../services/ProductReviewService";
import { Request, Response } from 'express';

export const createProductReview = async (req: Request, res: Response) => {
  try {
    const review = await ProductReviewService.createProductReview(req, req.body);
    return res.status(201).json(review);
  } catch (error:any) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const getAllProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await ProductReviewService.getAllProductReviews(Number(req.params.productId));
    return res.status(200).json(reviews);
  } catch (error:any) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const getProductReviewById = async (req: Request, res: Response) => {
  try {
    const review = await ProductReviewService.getProductReviewById(Number(req.params.reviewId));
    return res.status(200).json(review);
  } catch (error:any) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const updateProductReview = async (req: Request, res: Response) => {
  try {
    const review = await ProductReviewService.updateProductReview(Number(req.params.reviewId), req.body);
    return res.status(200).json(review);
  } catch (error:any) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const deleteProductReview = async (req: Request, res: Response) => {
  try {
    const review = await ProductReviewService.deleteProductReview(Number(req.params.reviewId));
    return res.status(200).json(review);
  } catch (error:any) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}