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
exports.findPerusahaanByName = exports.findPerusahaanById = exports.findBarangById = void 0;
const findBarangById = (id, db) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const barangEntity = yield db
            .createQueryBuilder('barang')
            .leftJoinAndSelect('barang.perusahaan', 'perusahaan')
            .where('barang.id = :id', { id })
            .getOne();
        return barangEntity;
    }
    catch (error) {
        console.error('Failed to find Barang by id:', error);
        return null;
    }
});
exports.findBarangById = findBarangById;
const findPerusahaanById = (id, db) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const perusahaanEntity = yield db.findOne({ where: { id: id } });
        return perusahaanEntity;
    }
    catch (error) {
        console.error('Failed to find Perusahaan by id:', error);
        return null;
    }
});
exports.findPerusahaanById = findPerusahaanById;
const findPerusahaanByName = (nama, db) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const perusahaanEntity = yield db.findOne({ where: { nama: nama } });
        return perusahaanEntity;
    }
    catch (error) {
        console.error('Failed to find Perusahaan by nama:', error);
        return null;
    }
});
exports.findPerusahaanByName = findPerusahaanByName;
