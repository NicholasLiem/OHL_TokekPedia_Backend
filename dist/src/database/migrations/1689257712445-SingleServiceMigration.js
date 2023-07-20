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
exports.SingleServiceMigration1689257712445 = void 0;
const perusahaan_model_1 = require("../../models/perusahaan.model");
const barang_model_1 = require("../../models/barang.model");
const user_model_1 = require("../../models/user.model");
class SingleServiceMigration1689257712445 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const perusahaanRepository = queryRunner.manager.getRepository(perusahaan_model_1.Perusahaan);
            const barangRepository = queryRunner.manager.getRepository(barang_model_1.Barang);
            const userRepository = queryRunner.manager.getRepository(user_model_1.UserModel);
            const perusahaan_1 = new perusahaan_model_1.Perusahaan("PT. Indofood Technologies", "08123456789", "PTI", "Jl. Raya Bogor");
            yield perusahaanRepository.insert(perusahaan_1);
            const perusahaan_2 = new perusahaan_model_1.Perusahaan("PT. Hyundai Technologies", "08123456789", "PHT", "Jl. Raya Bogor");
            yield perusahaanRepository.insert(perusahaan_2);
            for (let i = 1; i <= 10; i++) {
                const perusahaanCode = this.generateRandomCode(3);
                const perusahaan = new perusahaan_model_1.Perusahaan(`PT. ${String.fromCharCode(65 + i)}`, "08123456789", perusahaanCode, `Jl. ${String.fromCharCode(65 + i)}`);
                yield perusahaanRepository.insert(perusahaan);
                for (let j = 1; j <= 10; j++) {
                    const barangCode = this.generateRandomCode(3);
                    const barang = new barang_model_1.Barang(`Barang ${String.fromCharCode(65 + j)}`, this.getRandomPrice(), this.getRandomStock(), perusahaan, barangCode);
                    yield barangRepository.insert(barang);
                }
            }
            // Inserting admin user
            const user = new user_model_1.UserModel("admin", "admin", "admin");
            yield userRepository.insert(user);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    generateRandomCode(length) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    }
    getRandomPrice() {
        return Math.floor(Math.random() * 1000000);
    }
    getRandomStock() {
        return Math.floor(Math.random() * 100);
    }
}
exports.SingleServiceMigration1689257712445 = SingleServiceMigration1689257712445;
