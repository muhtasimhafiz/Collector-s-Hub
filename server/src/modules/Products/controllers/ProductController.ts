import {Request, Response} from 'express';
import productService from '../services/ProductService';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {name, description, price, seller_id} = req.body;
    const newProduct = await productService.createProduct(req,{name, description, price, seller_id});
    res.status(201).json(newProduct);
  } catch (error) {
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
  } catch (error) {
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