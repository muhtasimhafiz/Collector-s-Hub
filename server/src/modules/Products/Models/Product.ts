import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../../config/database';
import { IProduct } from '../interfaces/IProduct';
import { ProductCategory } from './ProductCategory';
import { ProductJoinCategory } from './ProductJoinCategory';
import { User } from '../../Users/models/User';
import { ProductReview } from './ProductReview';
import { AllowNull } from 'sequelize-typescript';
import { IProductBid } from '../../ProductBid/types';

export type ProductCreationAttributes = Optional<IProduct, 'id' | 'status' | 'bidding' | 'ratings' | 'quantity' | 'currency' | 'created_by' | 'updated_by' | 'deleted'>;
export class Product extends Model<IProduct, ProductCreationAttributes> {
  public id!: number;
  public name!: string;
  public description?: string;
  public status!: 'active' | 'inactive' | 'archived';
  public seller_id!: number;
  public price!: number;
  public bidding!: boolean;

  
  public ratings?: number;
  public quantity?: number;
  public currency?: string;
  public image!: string;
  public deleted!: boolean;
  public deleted_at?: Date | null;
  public deleted_by?: number | null;
  public created_at?: Date;
  public created_by!: number | null;
  public updated_at?: Date | null;
  public updated_by!: number | null;
  public reviews!: ProductReview[];
  public bids!: IProductBid[];

}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'archived'),
    allowNull: false,
    defaultValue: 'active',
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  bidding: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  ratings: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
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
  }
}, {
  sequelize,
  defaultScope: {
    where: { deleted: false }
  },
  scopes: {
    withDeleted: {
      where: {},
    },
  },
  tableName: 'products',
  timestamps: true,
  underscored: true,
  modelName: 'Product',
  paranoid: true,
});

Product.belongsToMany(ProductCategory, {
  through: ProductJoinCategory,
  foreignKey: 'product_id',
  otherKey: 'category_id'
});

Product.belongsTo(User, {
  foreignKey: 'seller_id',
  as: 'seller'
});

Product.hasMany(ProductReview, {
  foreignKey: 'product_id',
  as: 'reviews'
});

User.hasMany(Product, {
  foreignKey: 'seller_id',
  as: 'products'

});

// Product.belongsToMany(ProductCategory, { through: ProductJoinCategory });
