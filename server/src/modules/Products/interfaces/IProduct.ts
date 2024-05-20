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
  
  deleted: boolean;
  deleted_at?: Date | null;
  deleted_by?: number | null;
  created_at?: Date;
  created_by: number | null;
  updated_at?: Date | null;
  updated_by: number | null;
}