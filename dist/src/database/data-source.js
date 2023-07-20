"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.POSTGRES_URI,
    ssl: true,
    // host: process.env.DB_HOST,
    // port: 5432,
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    entities: ["src/models/*.model.ts"],
    migrations: ['src/database/migrations/*.{js,ts}'],
    // migrationsRun: true,
    synchronize: true,
    logging: true,
});
