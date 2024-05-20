import { Model, FindOptions, CreateOptions, UpdateOptions, DestroyOptions, ModelCtor } from 'sequelize';
import { Request } from 'express';

class BaseService<T extends Model> {
  protected model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }
  // constructor(model: { new (): T }) {
  //   this.model = model;
  //   console.log(model);
  // }

  async create(req: Request | null, createAttrs: any): Promise<T> {
    try {
      let user_id = null;
      if (req && (req as any).user) {
        user_id = (req as any).user.id;
      }
      if (!user_id) throw new Error('User not found');
      createAttrs.created_by = user_id;

      const instance = await this.model.create(createAttrs);
      return instance.reload({ include: 'user' });
    } catch (error) {
      console.error(error);
      throw new Error(`Error creating the ${this.model.name}`);
    }
  }

  async findAll(req:Request|null,options: FindOptions = {}): Promise<T[]> {
    try {
      const data = await this.model.findAll(options);
      console.log(data);
      return data;
    } catch (error) {
      console.error(`Error retrieving ${this.model.name} instances:`, error);
      throw new Error(`Error retrieving ${this.model.name} instances`);
    }
  }

  async findById(req:Request|null,id: number, options: FindOptions = {}): Promise<T | null> {
    try {
      return await this.model.findByPk(id, options);
    } catch (error) {
      throw new Error(`Error retrieving ${this.model.name} instance`);
    }
  }

  async update(req:Request|null,id: number, updateAttrs: Partial<T>, options: UpdateOptions = {where:{}}): Promise<T | null> {
    try {
      const instance = await this.model.findByPk(id);
      if (instance) {
        await instance.update(updateAttrs, options);
        return instance;
      }
      return null;
    } catch (error) {
      throw new Error(`Error updating the ${this.model.name} instance`);
    }
  }

  async delete(req:Request|null,id: number, options: DestroyOptions = {}): Promise<T | null> {
    try {
      const instance = await this.model.findByPk(id);
      if (instance) {
        await instance.update({ deleted: true }, options);
        return instance;
      }
      return null;
    } catch (error) {
      throw new Error(`Error deleting the ${this.model.name} instance`);
    }
  }
}

export default BaseService;
