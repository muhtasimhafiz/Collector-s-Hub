import { DataTypes, Model, Optional } from "sequelize";
import { IProductBid } from "../types";
import { Product } from "../../Products/models/Product";
import { User } from "../../Users/models/User";

import { sequelize } from '../../../../config/database';


export type ProductBidCreationAttributes = Optional<IProductBid, 'id' | 'deleted'|'message'>;


export class ProductBid extends Model<IProductBid, ProductBidCreationAttributes> {
  public id!: number;
  public product_id!: number;
  public user_id!: number;
  public bid_price!: number;
  public status!: 'accepted' | 'pending' | 'rejected';
  public deleted!: boolean;
  public deleted_at?: Date | null;
  public deleted_by?: number | null;
  public created_at?: Date;
  public created_by!: number | null;
  public updated_at?: Date | null;
  public updated_by!: number | null;
  public message?: string;
}

ProductBid.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // references:{
    //   model: Product,
    //   key: 'id'
    // }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // references:{}
  },

  bid_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM('accepted', 'pending', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },

  message: {
    type: DataTypes.STRING,
    allowNull: true,
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
},
  {
    sequelize,
    defaultScope: {
      where: { deleted: false }
    },
    scopes: {
      withDeleted: {
        where: {},
      },
    },
    tableName: 'product_bids',
    timestamps: true,
    underscored: true,
    modelName: 'ProductBid',
    paranoid: true,
  }


)

ProductBid.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
})

ProductBid.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
})

User.hasMany(ProductBid, {
  foreignKey: 'user_id',
  as: 'bids'
})


Product.hasMany(ProductBid, {
  foreignKey: 'product_id',
  as: 'bids'
})