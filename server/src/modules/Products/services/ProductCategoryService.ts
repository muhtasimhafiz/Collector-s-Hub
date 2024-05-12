import { ProductCategory } from '../models/ProductCategory';
import { IProductCategory } from '../interfaces/IProductCategory';


interface CreateProductCategoryDTO {
  name: string;
  description?: string;
  status?: 'active' | 'inactive' | 'archived';
  created_by?: number;
}
class ProductCategoryService {
  async createProductCategory(categoryDetails: CreateProductCategoryDTO): Promise<ProductCategory> {
    try {
      const newCategory = await ProductCategory.create({
        ...categoryDetails,
        status: 'active', // default status
        deleted: false   // default deleted flag
      }); 
      return newCategory;
    } catch (error) {
      console.log(error);
      throw new Error('Error creating the product category');
    }
  }

  async getAllProductCategories(): Promise<ProductCategory[]> {
    try {
      const categories = await ProductCategory.findAll();
      return categories;
    } catch (error) {
      console.log(error);
      throw new Error('Error retrieving product categories');
    }
  }

  async getProductCategoryById(categoryId: number): Promise<ProductCategory | null> {
    try {
      const category = await ProductCategory.findByPk(categoryId);
      return category;
    } catch (error) {
      throw new Error('Error retrieving the product category');
    }
  }

  async updateProductCategory(categoryId: number, categoryDetails: Partial<IProductCategory>): Promise<ProductCategory | null> {
    try {
      const category = await ProductCategory.findByPk(categoryId);
      if (category) {
        await category.update(categoryDetails);
        return category;
      }
      return null;
    } catch (error) {
      throw new Error('Error updating the product category');
    }
  }

  async deleteProductCategory(categoryId: number): Promise<void> {
    try {
      const category = await ProductCategory.findByPk(categoryId);
      if (category) {
        await category.destroy();
      } else {
        throw new Error('Product category not found');
      }
    } catch (error) {
      throw new Error('Error deleting the product category');
    }
  }
}

export default new ProductCategoryService();