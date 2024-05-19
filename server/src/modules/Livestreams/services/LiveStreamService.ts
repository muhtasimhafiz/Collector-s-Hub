import BaseService from "../../../service/BaseService";
import { Livestream, LivestreamCreationAttributes } from "../models/Livestream";
import { ILivestream } from "../types";
import { Request } from 'express';

class LivestreamService  {
  // constructor() {
  //   super(Livestream); // Pass the model argument to the super() call
  // }
 
  async createLivestream(req: Request, details: LivestreamCreationAttributes): Promise<Livestream> {
    try {
      let user_id = null;
      if ((req as any).user) {
        user_id = (req as any).user.id;
      }
      if(!user_id) throw new Error('User not found');
      const entity = await Livestream.create({ ...details, created_by: user_id });
      return entity;
    } catch (error:any) {
      throw new Error('Error creating the livestream');
      console.log(error.message)
    }
  }

  async getAllLivestreams(where: Partial<ILivestream>): Promise<ILivestream[]> {
    const entities = await Livestream.findAll({ where, include: ['user'] });
    return entities;
  }

  async getLivestreamById(id: number): Promise<ILivestream | null> {
    try {
      const entity = await Livestream.findByPk(id);
      return entity;
    } catch (error) {
      throw new Error('Error retrieving the livestream by ID');
    }
  }

  async deleteLivestream(id: number): Promise<boolean> {
    try {
      const entity = await Livestream.findByPk(id);
      if (entity) {
        await entity.destroy();
        return true;
      }
      return false;
    } catch (error) {
      throw new Error('Error deleting the livestream');
    }
  }


  async updateLivestream(req:Request,id: number, details: Partial<ILivestream>): Promise<ILivestream | null> {
    try {
      const entity = await Livestream.findByPk(id);
      if (entity) {
        await entity.update(details);
        return entity;
      }
      return null;
    } catch (error) {
      throw new Error('Error updating the livestream');
    }
  }

  async findOne(where: Partial<ILivestream>): Promise<ILivestream | null> {
    try {
      const entity = await Livestream.findOne({ where });
      return entity;
    } catch (error: any) {
      console.log(error.message)
      throw new Error('Error retrieving the livestream');
    }
  }

  async findOrCreate(where: Partial<ILivestream>, defaults: LivestreamCreationAttributes): Promise<ILivestream> {
    try {
      const [entity] = await Livestream.findOrCreate({ where, defaults });
      return entity;
    } catch (error) {
      throw new Error('Error finding or creating the livestream');
    }
  }

  async updateWhere(where: Partial<ILivestream>, details: Partial<ILivestream>): Promise<ILivestream[]> {
    try {
      const [affectedCount] = await Livestream.update(details, { where });
      if (affectedCount === 0) {
        return [];
      }
      const entities = await Livestream.findAll({ where });
      console.log(entities)
      return entities;
    } catch (error) {
      throw new Error('Error updating the livestreams');
    }
  }
 
}

export default new LivestreamService(); // Create an instance of the LivestreamService class and export it