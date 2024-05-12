import {Product} from '../models/Product';
import {IProduct} from '../interfaces/IProduct';

class ProductService {
  async createProduct(productDetails: IProduct): Promise<Product> {
    try {
      const product = await Product.create(productDetails);
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
    try {
      const product = await Product.findByPk(productId);
      return product;
    } catch (error) {
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

export default ProductService;