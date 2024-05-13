import { Model, FindOptions } from 'sequelize';
import { Request } from 'express';

abstract class BaseService<T extends Model> {
  constructor(private model: { new (): T } & typeof Model, private request: Request) {}

async create(item: Partial<T>): Promise<T> {
    return this.model.create(item);
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options);
  }

  async findById(id: number): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async update(id: number, item: Partial<T>): Promise<[number, T[]]> {
    return this.model.update(item, { where: { id } });
  }

  async delete(id: number): Promise<void> {
    const item = await this.model.findByPk(id);
    if (item) {
      await item.destroy();
    }
  }
}

export default BaseService;
