import { In } from "typeorm";
import { IProductReview } from "../interfaces/IProductReview";
import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from "../../../../config/database";
import { Product } from "./Product";


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
}, {
  sequelize,
  modelName: 'ProductReview',
  tableName: 'product_reviews',
  timestamps: false,
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

// ProductReview.belongsTo(Product, {
//   foreignKey: 'product_id',
//   as : 'product'
// });