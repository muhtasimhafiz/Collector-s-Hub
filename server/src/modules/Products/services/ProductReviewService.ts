import { ProductReview, ProductReviewCreationAttributes } from "../models/ProductReview";
import { Request } from 'express';

class ProductReviewService {
  async createProductReview(req: Request | null, reviewDetails: ProductReviewCreationAttributes): Promise<ProductReview> {
    try {
      let user_id = null;
      if ((req as any).user) {
        user_id = (req as any).user.id;
      }
      const review = await ProductReview.create({ ...reviewDetails, created_by: user_id });
      return review;
    } catch (error) {
      throw new Error('Error creating the review');
    }
  }

  async getAllProductReviews(productId: number): Promise<ProductReview[]> {
    try {
      const reviews = await ProductReview.findAll({
        where: {
          product_id: productId
        }
      });
      return reviews;
    } catch (error) {
      throw new Error('Error retrieving reviews');
    }
  }

  async getProductReviewById(reviewId: number): Promise<ProductReview | null> {
    try {
      const review = await ProductReview.findByPk(reviewId);
      return review;
    } catch (error) {
      throw new Error('Error retrieving review');
    }
  }

  async updateProductReview(reviewId: number, reviewDetails: Partial<ProductReview>): Promise<ProductReview | null> {
    try {
      const review = await ProductReview.findByPk(reviewId);
      if (review) {
        await review.update(reviewDetails);
        return review;
      }
      return null;
    } catch (error) {
      throw new Error('Error updating the review');
    }
  }

  async  deleteProductReview(reviewId: number): Promise<ProductReview | null> {
    try {
      const review = await ProductReview.findByPk(reviewId);
      if (review) {
        await review.update({ deleted: true });
        return review;
      }
      return null;
    } catch (error) {
      throw new Error('Error deleting the review');
    }
    
  }
}



export default new ProductReviewService();