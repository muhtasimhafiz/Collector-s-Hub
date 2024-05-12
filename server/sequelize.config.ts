import { SequelizeOptions } from 'sequelize-typescript';

const config: { [env: string]: SequelizeOptions } = {
  development: {
    username: 'postgres',
    password: 'admin',
    database: 'collectors_hub',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    models: [__dirname + '/modules/**/models/*.ts'], // Adjust this path as necessary
  },
  test: {
    username: 'postgres',
    password: 'admin',
    database: 'collectors_hub',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    models: [__dirname + '/modules/**/models/*.ts'], // Adjust this path as necessary
  },
  production: {
    username: 'postgres',
    password: 'admin',
    database: 'collectors_hub',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    models: [__dirname + '/modules/**/models/*.ts'], // Adjust this path as necessary
  }
};

export default config;
