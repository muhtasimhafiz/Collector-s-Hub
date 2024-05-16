import { In } from "typeorm";
import { IProductReview } from "../interfaces/IProductReview";
import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from "../../../../config/database";
import { Product } from "./Product";
import { User } from "../../Users/models/User";


export type ProductReviewCreationAttributes = {
  product_id: number;
  user_id: number;
  review: string;
  
  deleted?: boolean;
  deleted_at?: Date | null;
  deleted_by?: number | null;
  created_at?: Date;
  created_by: number | null;
  updated_at?: Date | null;
  updated_by: number | null;
}
export class ProductReview extends Model<IProductReview, ProductReviewCreationAttributes> {
  public id!: number;
  public product_id!: number;
  public user_id!: number;
  public review!: string;
  // public deleted!: boolean;
  // public deleted_at?: Date | null;
  // public deleted_by?: number | null;
  // public created_at?: Date;
  // public updated_at?: Date | null;
  // public created_by?: number | null;
  // public updated_by?: number | null;
}

ProductReview.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  review: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deleted_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'created_at'
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'updated_at'
  },
},  {
  sequelize,
  modelName: 'ProductReview',
  tableName: 'product_reviews',
  timestamps: true,
  underscored: true,
  paranoid: true,
  defaultScope: {
    where: { deleted: false }
  },
  scopes: {
    withDeleted: {
      where: {},
    },
  },
})


ProductReview.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});