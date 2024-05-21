import { IProduct } from "../Products/interfaces/IProduct";
import { User } from "../Users/models/User";

export interface IProductBidStatus  {
  accepted: 'accepted';
  pending: 'pending';
  rejected: 'rejected';
  completed: 'completed';
  cancelled : 'cancelled';
};

export const ProductBidStatus: IProductBidStatus = {
  accepted: 'accepted',
  pending: 'pending',
  rejected: 'rejected',
  completed: 'completed',
  cancelled : 'cancelled'
};

export interface IProductBid {
  id: number;
  product_id: number;
  user_id: number;
  bid_price: number;
  status: 'accepted' | 'pending' | 'rejected';
  message?: string;


  product?: IProduct;
  user?: User;
  deleted: boolean;
  deleted_at?: Date | null;
  deleted_by?: number | null;
  created_at?: Date;
  created_by: number | null;
  updated_at?: Date | null;
  updated_by: number | null;
}