export interface IProduct {
  id: number;
  name:string,
  description?: string;
  seller_id: number;
  status: string;
  bidding?: boolean;
  price: number;
  image:string;

  ratings?: number;
  quantity?: number;
  currency?: string;
  deleted: boolean;
  deleted_at?: Date | null;
  deleted_by?: number | null;
  created_at?: Date;
  created_by: number | null;
  updated_at?: Date | null;
  updated_by: number | null;
}

export interface IProductCategory {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  created_at?: Date;
  created_by?: number;
  deleted?: boolean;
  deleted_by?: number;
  deleted_at?: Date;
  updated_at?: Date;
  updated_by?: number;
}


export interface IProductReview {
  id: number;
  product_id: number;
  user_id: number;
  review: string;
  deleted: boolean;
  deleted_at?: Date | null;
  deleted_by?: number | null;
  created_at?: Date;
  created_by: number | null;
  updated_at?: Date | null;
  updated_by: number | null;
}


export interface IProductBid {
  id:number;
  product_id:number;
  user_id:number;
  price?:number;
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