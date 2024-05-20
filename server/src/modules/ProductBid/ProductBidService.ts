import BaseService from "../../service/BaseService";
import { ProductBid } from "./models/ProductBid";
import {Request} from 'express';

// class ProductBidService  {
//   // private model: Model<Product,>;
//   async findAll(req: Request|null): Promise<ProductBid[]> {
//     try {
//       // Add any request-specific filtering logic here if needed
//       const productBids = await ProductBid.findAll();
//       return productBids;
//     } catch (error) {
//       console.error('Error retrieving ProductBid instances:', error);
//       throw new Error('Error retrieving ProductBid instances');
//     }
//   }
// }



class ProductBidService extends BaseService<ProductBid> {
  // private model: Model<Product,>;
  constructor() {
    super(ProductBid);
  }
}
export default new ProductBidService();