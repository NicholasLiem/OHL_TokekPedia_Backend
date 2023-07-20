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
exports.BarangController = void 0;
const barang_model_1 = require("../models/barang.model");
const perusahaan_model_1 = require("../models/perusahaan.model");
const controller_utils_1 = require("../utils/controller.utils");
const response_utils_1 = require("../utils/response.utils");
class BarangController {
    constructor(db) {
        this.db = db;
        this.barangRepository = this.db.getRepository(barang_model_1.Barang);
        this.perusahaanRepository = this.db.getRepository(perusahaan_model_1.Perusahaan);
    }
    createBarang(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nama, harga, stok, perusahaan_id, kode } = req.body;
            try {
                const barangEntity = yield this.barangRepository.findOne({ where: { kode: kode } });
                if (barangEntity) {
                    return response_utils_1.ResponseUtil.sendError(res, 400, 'Barang with the code given already exists', barangEntity);
                }
                // Kasus ketika perusahaan_id is name instead of UUID
                // Bug: Harusnya Fixed sih sekarang
                const perusahaanEntityByName = yield (0, controller_utils_1.findPerusahaanByName)(perusahaan_id, this.perusahaanRepository);
                if (perusahaanEntityByName) {
                    const barang = new barang_model_1.Barang(nama, harga, stok, perusahaanEntityByName, kode);
                    yield this.barangRepository.save(barang);
                    return response_utils_1.ResponseUtil.sendResponseBarang(res, 201, 'Barang created successfully', barang);
                }
                const perusahaanEntity = yield (0, controller_utils_1.findPerusahaanById)(perusahaan_id, this.perusahaanRepository);
                if (!perusahaanEntity) {
                    return response_utils_1.ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.body);
                }
                const barang = new barang_model_1.Barang(nama, harga, stok, perusahaanEntity, kode);
                yield this.barangRepository.save(barang);
                return response_utils_1.ResponseUtil.sendResponseBarang(res, 201, 'Barang created successfully', barang);
            }
            catch (error) {
                return response_utils_1.ResponseUtil.sendError(res, 500, 'Failed to create Barang', req.body);
            }
        });
    }
    getBarang(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const barangEntity = yield (0, controller_utils_1.findBarangById)(id, this.barangRepository);
                if (!barangEntity) {
                    return response_utils_1.ResponseUtil.sendError(res, 404, 'Barang not found', req.params);
                }
                return response_utils_1.ResponseUtil.sendResponseBarang(res, 200, 'Barang found', barangEntity);
            }
            catch (error) {
                return response_utils_1.ResponseUtil.sendError(res, 500, 'Failed to get Barang', req.params);
            }
        });
    }
    searchBarang(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { q, perusahaan } = req.query;
            try {
                const searchString = q === null || q === void 0 ? void 0 : q.toString();
                const perusahaanString = perusahaan === null || perusahaan === void 0 ? void 0 : perusahaan.toString();
                // Return all if both null
                if (!searchString && !perusahaanString) {
                    const barangData = yield this.barangRepository
                        .createQueryBuilder('barang')
                        .leftJoinAndSelect('barang.perusahaan', 'perusahaan')
                        .getMany();
                    return response_utils_1.ResponseUtil.sendResponseBarangArray(res, 200, 'Barang found', barangData);
                }
                // Case: Perusahaan Id given & Search String null
                if (perusahaanString && !searchString) {
                    const perusahaanEntity = yield (0, controller_utils_1.findPerusahaanById)(perusahaanString, this.perusahaanRepository);
                    if (!perusahaanEntity) {
                        return response_utils_1.ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.query);
                    }
                    const barangData = yield this.barangRepository
                        .createQueryBuilder('barang')
                        .leftJoinAndSelect('barang.perusahaan', 'perusahaan')
                        .where('perusahaan.id = :perusahaanString', { perusahaanString })
                        .getMany();
                    return response_utils_1.ResponseUtil.sendResponseBarangArray(res, 200, 'Barang found', barangData);
                }
                // Case: Search String given & Perusahaan Name null
                if (!perusahaanString && searchString) {
                    const barangData = yield this.barangRepository
                        .createQueryBuilder('barang')
                        .leftJoinAndSelect('barang.perusahaan', 'perusahaan')
                        .where('barang.nama LIKE :searchString OR barang.kode LIKE :searchString', { searchString: `%${searchString}%` })
                        .getMany();
                    return response_utils_1.ResponseUtil.sendResponseBarangArray(res, 200, 'Barang found', barangData);
                }
                // Case: Both given
                const barangData = yield this.barangRepository
                    .createQueryBuilder('barang')
                    .leftJoinAndSelect('barang.perusahaan', 'perusahaan')
                    .where('barang.nama LIKE :searchString OR barang.kode LIKE :searchString', { searchString: `%${searchString}%` })
                    .andWhere('perusahaan.id = :perusahaanString', { perusahaanString })
                    .getMany();
                return response_utils_1.ResponseUtil.sendResponseBarangArray(res, 200, 'Barang found', barangData);
            }
            catch (error) {
                return response_utils_1.ResponseUtil.sendError(res, 500, 'Failed to search barang', []);
            }
        });
    }
    updateBarang(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { nama, harga, stok, perusahaan_id, kode } = req.body;
            try {
                const barangEntity = yield (0, controller_utils_1.findBarangById)(id, this.barangRepository);
                if (!barangEntity) {
                    return response_utils_1.ResponseUtil.sendError(res, 404, 'Barang not found', req.params);
                }
                const perusahaanEntity = yield (0, controller_utils_1.findPerusahaanById)(perusahaan_id, this.perusahaanRepository);
                if (!perusahaanEntity) {
                    return response_utils_1.ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.body);
                }
                if (nama == null || harga == null || stok == null || kode == null || perusahaan_id == null) {
                    return response_utils_1.ResponseUtil.sendError(res, 400, 'Barang data is not complete', req.body);
                }
                const barangWithSameKode = yield this.barangRepository.findOne({ where: { kode, perusahaan: perusahaanEntity } });
                if (barangWithSameKode && barangWithSameKode.id !== barangEntity.id) {
                    return response_utils_1.ResponseUtil.sendError(res, 400, 'Barang with the code given already exists', barangWithSameKode);
                }
                barangEntity.nama = nama;
                barangEntity.harga = harga;
                barangEntity.stok = stok;
                barangEntity.perusahaan = perusahaanEntity;
                barangEntity.kode = kode;
                yield this.barangRepository.save(barangEntity);
                return response_utils_1.ResponseUtil.sendResponseBarang(res, 200, 'Barang updated successfully', barangEntity);
            }
            catch (error) {
                return response_utils_1.ResponseUtil.sendError(res, 500, 'Failed to update Barang', req.body);
            }
        });
    }
    deleteBarangById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const barangEntity = yield (0, controller_utils_1.findBarangById)(id, this.barangRepository);
                if (!barangEntity) {
                    return response_utils_1.ResponseUtil.sendError(res, 404, 'Barang not found', null);
                }
                yield this.barangRepository.delete(barangEntity);
                return response_utils_1.ResponseUtil.sendResponseBarang(res, 200, 'Barang deleted successfully', barangEntity);
            }
            catch (error) {
                return response_utils_1.ResponseUtil.sendError(res, 500, 'Failed to delete Barang', null);
            }
        });
    }
}
exports.BarangController = BarangController;
