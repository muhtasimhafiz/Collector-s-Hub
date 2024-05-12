import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../../config/database'; 
import { IProductCategory } from '../interfaces/IProductCategory';

type ProductCategoryCreationAttributes = Optional<IProductCategory, 'id'>;
export class ProductCategory extends Model<IProductCategory, ProductCategoryCreationAttributes> {
  public id!: number;
  public name!: string;
  public description?: string;
  public status!: 'active' | 'inactive' | 'archived';
}

ProductCategory.init({
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
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'archived'),
    allowNull: false,
    defaultValue: 'active',
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  updated_by: {
    type: DataTypes.INTEGER,
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
  tableName: 'product_categories',
  timestamps: true,
  underscored: true,
  modelName: 'ProductCategory',
});