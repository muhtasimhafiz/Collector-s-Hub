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
