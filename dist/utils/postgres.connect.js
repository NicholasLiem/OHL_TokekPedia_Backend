"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../database/data-source");
function postgresSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const AppDataSource = data_source_1.dataSource;
            AppDataSource.initialize();
            console.log('Connected to PostgreSQL');
            return AppDataSource;
        }
        catch (error) {
            console.error(error);
            console.error('Could not connect to PostgreSQL');
            process.exit(1);
        }
    });
}
exports.default = postgresSetup;
