import { Model, DataTypes, BuildOptions, HookReturnOptions, ModelAttributes, InitOptions } from 'sequelize';
import { sequelize } from '../../config/database'; 

interface BaseModelAttributes {
    created_at: Date;
    created_by?: number;
    updated_at?: Date;
    updated_by?: number;
    deleted: boolean;
    deleted_at?: Date;
    deleted_by?: number;
}

// Modify T to extend BaseModelAttributes to ensure that type is correct for Sequelize
export class BaseModel<T extends BaseModelAttributes = BaseModelAttributes> extends Model<T, Partial<T>> {
    public created_at!: Date;
    public created_by?: number;
    public updated_at?: Date;
    public updated_by?: number;
    public deleted!: boolean;
    public deleted_at?: Date;
    public deleted_by?: number;

    static initModel(attributes: ModelAttributes<BaseModel, Partial<BaseModelAttributes>>, options: InitOptions<BaseModel>) {
        BaseModel.init({
            ...attributes,
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
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
            deleted: {
                type: DataTypes.BOOLEAN,
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
        }, {
            sequelize,
            ...options,
            // hooks: {
            //     beforeCreate: (model: BaseModel, options: BuildOptions) => {
            //         if (options.context?.userId) {
            //             model.created_by = options.context.userId;
            //         }
            //     },
            //     beforeUpdate: (model: BaseModel, options: HookReturnOptions) => {
            //         if (options.context?.userId) {
            //             model.updated_by = options.context.userId;
            //         }
            //     }
            // },
            defaultScope: {
                where: { deleted: false }
            },
            scopes: {
                withDeleted: {
                    where: {},
                },
            }
        });
    }
}
