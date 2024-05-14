export interface User {
  id: number;
  username: string;
  password: string;
  email?: string;
  contact_number?: string;
  country?: string;
  seller?: boolean;
  user_access_id?: number;
  followers?: number;
  following?: number;
  stars?: number;
  reviews?: number;
  is_admin:boolean;
  deleted: boolean;
  deleted_at?: Date;
  deleted_by?: number;
  created_at: Date;
  created_by?: number;
  updated_at?: Date;
  updated_by?: number; 
}


export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token:string) => void;
  logout: () => void;
  getToken(): string | null;
}