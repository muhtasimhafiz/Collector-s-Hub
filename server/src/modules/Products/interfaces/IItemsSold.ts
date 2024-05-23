import { IProduct } from "./IProduct";
import { IProductBid } from "./IProductBid";
import { User } from "../../Users/models/User";

export interface IItemsSold {
  id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  buyer_id: number;
  product_bid_id: number;
  
  seller?:User;
  buyer?:User;
  product?:IProduct;
  bid?:IProductBid;

  deleted: boolean;
  deleted_at?: Date | null;
  deleted_by?: number | null;
  created_at?: Date;
  created_by: number | null;
  updated_at?: Date | null;
  updated_by: number | null;
}