import { Product, ProductCreationAttributes } from '../models/Product';
import { IProduct } from '../interfaces/IProduct';
import { Request } from 'express';
import { ProductCategory } from '../models/ProductCategory';
import { ProductJoinCategory } from '../models/ProductJoinCategory';
import { sequelize } from '../../../../config/database';


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

  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await Product.findAll();
      return products;
    } catch (error) {
      throw new Error('Error retrieving products');
    }
  }

  async getProductById(productId: number): Promise<Product | null> {
    console.log('getProductById');
    try {

      const product = await Product.findByPk(productId,
        {
          include: [
            {
              model: ProductCategory,
              through: { attributes: [] }, // This will skip the join table attributes
            },
            'seller'
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