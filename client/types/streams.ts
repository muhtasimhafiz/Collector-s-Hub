import { User } from "./user";

export interface ILivestream {
  id: number;
  user_id: number;
  uuid:string
  status?:'live'|'offline';

  user?:User;

  deleted: boolean;
  deleted_at?: Date | null;
  deleted_by?: number | null;
  created_at?: Date;
  created_by: number | null;
  updated_at?: Date | null;
  updated_by: number | null;
} 