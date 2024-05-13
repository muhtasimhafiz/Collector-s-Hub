import { ProductCategory } from "./ProductCategory";
import { Product } from "./Product";
import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../../../config/database'; 

export class ProductJoinCategory extends Model {
  public product_id!: number;
  public category_id!: number;
}

ProductJoinCategory.init(
  {
    id : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key:'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductCategory,
        key:'id'
      }
    },
  },
  {
    sequelize,
    paranoid: true,
    tableName: "products_join_categories",
    modelName: "ProductJoinCategory",
    timestamps: false,
  }
);

// Define associations
// Product.belongsToMany(ProductCategory, {
//   through: ProductJoinCategory,
//   foreignKey: 'product_id',
//   otherKey: 'category_id'
// });

// ProductCategory.belongsToMany(Product, {
//   through: ProductJoinCategory,
//   foreignKey: 'category_id',
//   otherKey: 'product_id'
// });