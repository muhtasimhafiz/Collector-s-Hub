export interface IProductBid {
  id:number;
  product_id:number;
  user_id:number;
  bid_price?:number;
  currency?:string;
  status:string;
  item_id?:string;

  created_at?: Date;
  created_by?: number;
  deleted?: boolean;
  deleted_by?: number;
  deleted_at?: Date;
  updated_at?: Date;
  updated_by?: number;
}