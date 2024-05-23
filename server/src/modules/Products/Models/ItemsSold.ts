import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../../config/database';
import { User } from '../../Users/models/User';
import { Product } from './Product';
import { ProductBid } from '../../ProductBid/models/ProductBid';
import { IItemsSold } from '../interfaces/IItemsSold';
import { IProduct } from '../interfaces/IProduct';
import { IProductBid } from '../interfaces/IProductBid';
import {User as IUser} from '../../Users/models/User';

export type ItemsSoldCreationAttributes = Optional<IItemsSold, 'id' | 'deleted' | 'deleted_at' | 'deleted_by' | 'created_at' | 'created_by' | 'updated_at' | 'updated_by'>;

export class ItemsSold extends Model<IItemsSold, ItemsSoldCreationAttributes> implements IItemsSold {
  public id!: number;
  public product_id!: number;
  public quantity!: number;
  public total_price!: number;
  public buyer_id!: number;
  public product_bid_id?: number;
  
  public deleted!: boolean;
  public deleted_at?: Date | null;
  public deleted_by?: number | null;
  public created_at?: Date;
  public created_by!: number | null;
  public updated_at?: Date | null;
  public updated_by!: number | null;

  public  seller?: IUser;
  public  buyer?: IUser;
  public  product?: IProduct;
  public  bid?: IProductBid;
}

ItemsSold.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  buyer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_bid_id: {
    type: DataTypes.INTEGER,
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
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
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
  tableName: 'items_sold',
  timestamps: true,
  underscored: true,
  modelName: 'ItemsSold',
  paranoid: true,
});

ItemsSold.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

ItemsSold.belongsTo(User, {
  foreignKey: 'buyer_id',
  as: 'buyer'
});

ItemsSold.belongsTo(ProductBid, {
  foreignKey: 'product_bid_id',
  as: 'bid'
});

Product.hasMany(ItemsSold, {
  foreignKey: 'product_id',
  as: 'items_sold'
});

User.hasMany(ItemsSold, {
  foreignKey: 'buyer_id',
  as: 'purchases'
});


