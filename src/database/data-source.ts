import { DataSource } from 'typeorm';
import dotEnv from 'dotenv';
import fs from 'fs'

dotEnv.config()
export const dataSource = new DataSource({
    type: 'postgres',
    // url: process.env.POSTGRES_URI,
    // ssl: {
    //     rejectUnauthorized: true,
    //     ca: fs.readFileSync('prod-ca-2021.crt').toString(),
    //     },
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["src/models/*.model.ts"],
    migrations: ['src/database/migrations/*.{js,ts}'],     
    // migrationsRun: true,
    synchronize: true, 
    logging: false, 
});