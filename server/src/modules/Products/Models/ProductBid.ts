
import {DataType } from "sequelize-typescript";
import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Product } from "./Product";
import { User } from "../../Users/models/User";
import { sequelize } from "../../../../config/database";
import { IProductBid } from "../interfaces/IProductBid";
import { Optional } from "sequelize";


export const product_bid_status = {accepted:'accepted',pending:'pending', rejected:'rejected'};

export type  ProductBidCrationAttributes = Optional<IProductBid, 'id'|'item_id'|'status'|'currency'>;
export class ProductBid extends Model<IProductBid, ProductBidCrationAttributes> {
  public id!: number;
  public product_id!: number;
  public user_id!: number;
  public status!: 'accepted' | 'pending' | 'rejected';
}

ProductBid.init({
  id: {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataType.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataType.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataType.STRING(3),
    allowNull: false,
  },
  status: {
    type: DataType.ENUM('accepted', 'pending', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },
  item_id: {
    type: DataType.STRING,
    allowNull: false,
  },
  created_by: {
    type: DataType.INTEGER,
    allowNull: true,
  },
  updated_by: {
    type: DataType.INTEGER,
    allowNull: true,
  },
  deleted: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },
  deleted_at: {
    type: DataType.DATE,
    allowNull: true,
  },
  deleted_by: {
    type: DataType.INTEGER,
    allowNull: true,
  },
}, {
  sequelize,
  underscored: true,
  defaultScope: {
    where: { deleted: false }
  },
  paranoid: true,
  scopes: {
    withDeleted: {
      where: { deleted: true }
    }
  }
});


ProductBid.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

ProductBid.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});