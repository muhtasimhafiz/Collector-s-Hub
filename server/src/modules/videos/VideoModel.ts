import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';
import { User } from '../Users/models/User';
import { IVideo } from './types';
import { Product } from '../Products/models/Product';

export type VideoCreationAttributes = Optional<IVideo, 'id' | 'deleted' | 'deleted_at' | 'deleted_by' | 'created_at' | 'created_by' | 'updated_at' | 'updated_by'>;

export class Video extends Model<IVideo, VideoCreationAttributes> {
  public id!: number;
  public duration?: number;
  public thumbnail!: string;
  public video!: string;
  public user_id!: number;
  public views?: number;
  public product_id?: number;
  public caption?: string;

  public deleted!: boolean;
  public deleted_at?: Date | null;
  public deleted_by?: number | null;
  public created_at?: Date;
  public created_by!: number | null;
  public updated_at?: Date | null;
  public updated_by!: number | null;
}

Video.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  thumbnail: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  video: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  caption: {
    type: new DataTypes.STRING,
    allowNull: true,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deleted_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  sequelize,
  defaultScope: {
    where: { deleted: false }
  },
  scopes: {
    withDeleted: {
      where: {},
    },
  },
  tableName: 'videos',
  timestamps: true,
  underscored: true,
  modelName: 'Video',
  paranoid: true,
});

Video.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

User.hasMany(Video, {
  foreignKey: 'user_id',
  as: 'videos'
});

Product.hasMany(Video, {
  foreignKey: 'product_id',
  as: 'videos'
});

Video.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

export default Video;