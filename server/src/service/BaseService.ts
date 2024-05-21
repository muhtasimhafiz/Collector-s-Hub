import { Model, FindOptions, CreateOptions, UpdateOptions, DestroyOptions, ModelCtor, Op } from 'sequelize';
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
      return instance;
    } catch (error) {
      console.error(error);
      throw new Error(`Error creating the ${this.model.name}`);
    }
  }
// add arguments for associations 
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
}

export default BaseService;
