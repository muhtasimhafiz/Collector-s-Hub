import {Request, Response} from 'express';
import productService from '../services/ProductService';
import { IProduct } from '../interfaces/IProduct';
import { ProductCreationAttributes } from '../models/Product';
import { sequelize } from '../../../../config/database';

export const createProduct = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {   
    const productDetails:ProductCreationAttributes = req.body as ProductCreationAttributes;
    const newProduct = await productService.createProduct(req, productDetails);
    if(req.body.category_id){
      console.log('category_id');
      await productService.addProductCategories(newProduct.id,req.body.category_id);
    }
    await transaction.commit();
    res.status(201).json(newProduct);
  } catch (error : any) {
    await transaction.rollback();
    console.log(error.message)
    res.status(500).json({message: (error as Error).message});
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const product = await productService.getProductById(Number(id));
    if (!product) {
      res.status(404).json({message: 'Product not found'});
      return;
    }
    res.json(product);
  } catch (error:any) {
    console.log(error.message)
    res.status(500).json({message: (error as Error).message});
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const {name, description, price} = req.body;
    const updatedProduct = await productService.updateProduct(Number(id), {name, description, price});
    if (!updatedProduct) {
      res.status(404).json({message: 'Product not found'});
      return;
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    await productService.deleteProduct(Number(id));
    res.status(204).send();
  } catch (error:any) {
    console.log(error.message)
    res.status(500).json({message: (error as Error).message});
  }
}