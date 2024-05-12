// controllers/productCategoryController.ts

import { Request, Response } from 'express';
import productCategoryService from '../services/ProductCategoryService';

export const createProductCategory = async (req: Request, res: Response) => {
  try {
    const { name, description} = req.body;
    const newCategory = await productCategoryService.createProductCategory({ name, description, created_by:(req as any).user.id});
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllProductCategories = async (req: Request, res: Response) => {
  console.log('getAllProductCategories');
  try {
    const categories = await productCategoryService.getAllProductCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProductCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await productCategoryService.getProductCategoryById(Number(id));
    if (!category) {
      res.status(404).json({ message: 'Product category not found' });
      return;
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProductCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description} = req.body;
    const updatedCategory = await productCategoryService.updateProductCategory(Number(id), { name, description});
    if (!updatedCategory) {
      res.status(404).json({ message: 'Product category not found' });
      return;
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteProductCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productCategoryService.deleteProductCategory(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
