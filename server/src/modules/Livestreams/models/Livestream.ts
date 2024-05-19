import { Model, DataTypes, Optional } from 'sequelize';
import { AllowNull } from 'sequelize-typescript';
import { sequelize } from '../../../../config/database';
import { ILivestream } from '../types';
import { User } from '../../Users/models/User';


export type LivestreamCreationAttributes = Optional<ILivestream, 'id' |'deleted'>;
export class Livestream extends Model<ILivestream,LivestreamCreationAttributes> {
  public id!: number;
  public user_id!: number;
  public uuid!: string;
  public deleted!: boolean;
  public created_by!: number | null;
  public updated_by!: number | null;

}

Livestream.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  uuid: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    // allowNull: false,
    defaultValue: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('live', 'offline'),
    allowNull: true,
    defaultValue:'live'
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
  modelName: 'Livestream',
  tableName: 'livestreams',
  timestamps: true,
  paranoid: true,
  underscored: true,
  // freezeTableName: true,
  // indexes: [
  //   {
  //     unique: true,
  //     fields: ['uuid']
  //   }
  // ]
})


Livestream.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});