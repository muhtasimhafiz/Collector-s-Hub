import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../../config/database';  // Adjust the path as needed
import { Product } from '../../Products/models/Product';

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
    first_name: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    last_name: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    username: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    contact_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    seller: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    user_access_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    followers: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    following: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    stars: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    reviews: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        // allowNull: true,
        defaultValue: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        // allowNull: true,
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

    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'users',
    sequelize: sequelize,
    timestamps: true,
    underscored: true,
});


// User.hasMany(Product, {
//     foreignKey: 'seller_id',
//     as: 'products'
// });