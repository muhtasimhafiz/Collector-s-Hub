import { ProductBid, ProductBidCrationAttributes, product_bid_status } from "../models/ProductBid";
import { IProductBid } from "../interfaces/IProductBid";
class ProductBidService {
  async createProductBid(req:Request,bidDetails: ProductBidCrationAttributes): Promise<IProductBid> {
    try {
      let user_id = null;
      if((req as any).user){
        user_id = (req as any).user.id;
      }
      const newBid = await ProductBid.create({...bidDetails, status: product_bid_status.pending, user_id: user_id});
      return newBid;
    } catch (error: any) {
      console.error('Error creating product bid:', error.message);
      throw error;
    }
  }

  async getAllProductBids(): Promise<IProductBid[]> {
    try {
      const bids = await ProductBid.findAll();
      return bids;
    } catch (error) {
      console.error('Error retrieving product bids:', error);
      throw error;
    }
  }

  async getProductBidById(bidId: number): Promise<IProductBid | null> {
    try {
      const bid = await ProductBid.findByPk(bidId);
      return bid;
    } catch (error) {
      console.error('Error retrieving product bid:', error);
      throw error;
    }
  }

  async updateProductBid(bidId: number, bidDetails: Partial<IProductBid>): Promise<IProductBid | null> {
    try {
      const bid = await ProductBid.findByPk(bidId);
      if (bid) {
        await bid.update(bidDetails);
        return bid;
      }
      return null;
    } catch (error) {
      console.error('Error updating product bid:', error);
      throw error;
    }
  }

  async deleteProductBid(bidId: number): Promise<void> {
    try {
      const bid = await ProductBid.findByPk(bidId);
      if (bid) {
        await bid.destroy();
      }
    } catch (error) {
      console.error('Error deleting product bid:', error);
      throw error;
    }
  }
}

export default new ProductBidService();