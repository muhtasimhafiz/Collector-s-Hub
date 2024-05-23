import { IProductBid } from "../../ProductBid/types";
import { User } from "../../Users/models/User";

export interface IProduct {
  id: number;
  name:string,
  description?: string;
  seller_id: number;
  status: string;
  image:string;
  bidding?: boolean;
  price: number;
  ratings?: number;
  quantity?: number;
  currency?: string;
  
  highestBid?: IProductBid;
  bids?: IProductBid[];
  // seller?: User;

  deleted: boolean;
  deleted_at?: Date | null;
  deleted_by?: number | null;
  created_at?: Date;
  created_by: number | null;
  updated_at?: Date | null;
  updated_by: number | null;
}




export interface IProductHostItem extends IProduct {
  highestBidder?: User;
  auction_status?:string
  highest_bid_id?:number;
}

export const auctionStatus = {
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  SOLD: 'sold',
  CANCELLED: 'cancelled',
};
