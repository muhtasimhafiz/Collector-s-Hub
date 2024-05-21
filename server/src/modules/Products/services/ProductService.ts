import { Product, ProductCreationAttributes } from '../models/Product';
import { IProduct } from '../interfaces/IProduct';
import { Request } from 'express';
import { ProductCategory } from '../models/ProductCategory';
import { ProductJoinCategory } from '../models/ProductJoinCategory';
import { sequelize } from '../../../../config/database';
import { ProductBid } from '../../ProductBid/models/ProductBid';
import { User } from '../../Users/models/User';
import { Op } from 'sequelize';


interface Category_id {
  value: number;
  label: string;
}

interface IProductServiceCreation extends ProductCreationAttributes {
  categoryIds?: Category_id[];
}

class ProductService {
  async createProduct(req: Request | null, productDetails: ProductCreationAttributes): Promise<Product> {
    try {
      let user_id = null;
      if ((req as any).user) {
        user_id = (req as any).user.id;
      }
      const product = await Product.create({ ...productDetails, status: 'active', seller_id: user_id });
      return product;
    } catch (error) {
      console.log(error);
      throw new Error('Error creating the product');
    }
  }

   parseQueryParams = (query: any) => {
    const where: any = {};
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const value = query[key];
        if (typeof value === 'object' && value !== null) {
          where[key] = {};
          for (const operator in value) {
            if (value.hasOwnProperty(operator)) {
              switch (operator) {
                case 'gt':
                  where[key][Op.gt] = value[operator];
                  break;
                case 'gte':
                  where[key][Op.gte] = value[operator];
                  break;
                case 'lt':
                  where[key][Op.lt] = value[operator];
                  break;
                case 'lte':
                  where[key][Op.lte] = value[operator];
                  break;
                // Add more cases for other operators as needed
                default:
                  where[key][Op.eq] = value[operator];
                  break;
              }
            }
          }
        } else {
          where[key] = value;
        }
      }
    }
    return where;
  };

  async getAllProducts(req:Request): Promise<Product[]> {
    try {
      const query = req.query
      const where = this.parseQueryParams(query);

      const products = await Product.findAll(
        {
          where: where,
          include: [
            {
              model: User,
              as: 'seller'
            },
            {
              model: ProductBid,
              as: 'bids',
              include: ['user'],
              required: false,
            }
          ]
        }
      );

      return products;
    } catch (error: any) {
      
      console.log(error.message)
      throw new Error('Error retrieving products');
    }
  }

  async getProductById(productId: number): Promise<Product | null> {
    console.log(productId)
    try {
      const product = await Product.findByPk(productId,
        {
          include: [
            {
              model: ProductCategory,
              through: { attributes: [] }, // This will skip the join table attributes
              required:false
            },
            'seller',
           {association: 'reviews', include: ['user'], required: false},
          ]
        }
      );
      return product;
    } catch (error: any) {
      console.log(error.message)

      throw new Error('Error retrieving product');
    }
  }

  async updateProduct(productId: number, productDetails: Partial<Product>): Promise<Product | null> {
    try {
      const product = await Product.findByPk(productId);
      if (product) {
        await product.update(productDetails);
        return product;
      }
      return null;
    } catch (error) {
      throw new Error('Error updating the product');
    }
  }

  async deleteProduct(productId: number): Promise<void> {
    try {
      const product = await Product.findByPk(productId);
      if (product) {
        await product.destroy();
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      throw new Error('Error deleting the product');
    }
  }


  async addProductCategories(product_id: number, categories: Category_id[]): Promise<void> {
    try {
      let  categoryInstances = categories.map(category => ({
        product_id  : product_id,
        category_id: category.value
      }));

      await ProductJoinCategory.bulkCreate(categoryInstances);
    } catch (error: any) {
      console.log(error.message)
      throw new Error('Error adding product categories');
    }
  }

}

export default new ProductService();