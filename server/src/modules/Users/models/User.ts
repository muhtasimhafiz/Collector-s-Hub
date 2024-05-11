import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../../config/database';  // Adjust the path as needed

export class User extends Model {
    public id!: number; // The '!' tells TypeScript that these properties will definitely be assigned
    public username!: string; // Updated from 'name' to 'username'
    public email!: string;
    public password!: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {  // Updated field name here
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true, // Ensuring username is unique
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: false,
    }
}, {
    tableName: 'users',
    sequelize: sequelize, // passing the `sequelize` instance is necessary here
    timestamps: true,     // indicates if Sequelize should handle `createdAt` and `updatedAt` fields
    underscored: true,    // indicates if field names should be snake_cased
});
