import {Product,ProductCreationAttributes} from '../models/Product';
import {IProduct} from '../interfaces/IProduct';
import {Request} from 'express';
import { ProductCategory } from '../models/ProductCategory';


class ProductService {
  async createProduct(req:Request|null,productDetails: ProductCreationAttributes): Promise<Product> {
    try {
      let user_id = null;
      if((req as any).user){
        user_id = (req as any).user.id;
      }
      const product = await Product.create({...productDetails, status: 'active',seller_id: user_id});
      return product;
    } catch (error) {
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
            }
          ]
        }
      );
      return product;
    } catch (error:any) {
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
}

export default new ProductService();