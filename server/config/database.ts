import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize({
    database: 'collectors_hub',
    dialect: 'postgres',
    username: 'postgres',
    password: 'admin',
    host: "localhost",
    port: 5432,
    models: [__dirname + '/../modules/**/models/*.ts'], // Adjust this path to where your models are stored
    logging: process.env.DB_LOGGING === 'true', // Based on your environment variable
});

// Initialize and authenticate the database connection
export const initializeDatabase = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

