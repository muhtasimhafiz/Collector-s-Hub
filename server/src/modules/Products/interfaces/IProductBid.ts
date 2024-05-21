import { IProduct } from "./IProduct";

export interface ProductBidStatus {
  accepeted:"accepted";
  pending:"pending";
  rejected:"rejected";
  completed:"completed";
  cancelled:"cancelled";
}
export interface IProductBid {
  id:number;
  product_id:number;
  user_id:number;
  bid_price?:number;
  currency?:string;
  status:string;
  item_id?:string;


  user?:User;
  created_at?: Date;
  created_by?: number;
  deleted?: boolean;
  deleted_by?: number;
  deleted_at?: Date;
  updated_at?: Date;
  updated_by?: number;
}

export  interface ProductWithHighestBid {
  highestBid: IProductBid;
  // user:User;
  product_id: number;
  product_name: string;
  product_description?: string;
  product_image: string;
}

export interface myHighestBids {
  product: IProduct;
  bid_price: number;
  status: string;
  message?: string;
  currenct_high_bid: IProductBid;
  // current_hight_bidder: User;
}