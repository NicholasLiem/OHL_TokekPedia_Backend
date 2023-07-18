import { DataSource } from 'typeorm';
import config from 'config';

export const dataSource = new DataSource({
    type: 'postgres',
    // url: config.get('postgresURI'),
    // ssl: true,
    host: config.get('dbHost'),
    port: config.get('dbPort'),
    username: config.get('dbUser'),
    password: config.get('dbPassword'),
    database: config.get('dbDatabase'),
    entities: ["src/models/*.model.ts"],
    migrations: ['src/database/migrations/*.{js,ts}'],     
    migrationsRun: true,
    // synchronize: true, 
    logging: true, 
});