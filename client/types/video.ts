export interface IVideo {
  id: number;
  duration?: number;
  thumbnail: string;
  video: string;
  user_id: number;
  views?: number;
  product_id?: number;
  caption?: string;

  deleted: boolean;
  deleted_at?: Date | null;
  deleted_by?: number | null;
  created_at?: Date;
  created_by: number | null;
  updated_at?: Date | null;
  updated_by: number | null;
}