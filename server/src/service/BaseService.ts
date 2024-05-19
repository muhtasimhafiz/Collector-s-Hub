import { Model } from 'sequelize';
import { Request } from 'express';

abstract class BaseService<T extends Model> {
  protected model: typeof Model & { new(): T };

  constructor(model: typeof Model & { new(): T }) {
    this.model = model;
  }

  async create(req: Request | null, details: Partial<T>): Promise<T> {
    let user_id = null;
    if ((req as any).user) {
        user_id = (req as any).user.id;
    }
    if(!user_id) throw new Error('User not found');
    const entity = await this.model.create({ ...details, created_by: user_id });
    return entity;
  }

  // other methods...
  async getAll(where: Partial<T>): Promise<T[]> {
    const entities = await this.model.findAll({ where });
    return entities;
  }

  async getById(id: number): Promise<T | null> {
    const entity = await this.model.findByPk(id);
    return entity;
  }

  async update(id: number, details: Partial<T>): Promise<T | null> {
    const entity = await this.model.findByPk(id);
    if (entity) {
      await entity.update(details);
      return entity;
    }
    return null;
  }

  async delete(id: number): Promise<T | null> {
    const entity = await this.model.findByPk(id);
    if (entity) {
      await entity.update({ deleted: true });
      return entity;
    }
    return null;
  }
}

export default BaseService;


//Usage
/* import BaseService from './BaseService';
import { ProductReview, ProductReviewCreationAttributes } from "../models/ProductReview";

class ProductReviewService extends BaseService<ProductReview, ProductReviewCreationAttributes> {
  constructor() {
    super(ProductReview);
  }
}

export default new ProductReviewService(); */