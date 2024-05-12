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