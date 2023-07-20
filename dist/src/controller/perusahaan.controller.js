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
exports.PerusahaanController = void 0;
const perusahaan_model_1 = require("../models/perusahaan.model");
const barang_model_1 = require("../models/barang.model");
const controller_utils_1 = require("../utils/controller.utils");
const response_utils_1 = require("../utils/response.utils");
function isCapitalThreeLetterString(str) {
    const regex = /^[A-Z]{3}$/;
    return regex.test(str);
}
class PerusahaanController {
    constructor(db) {
        this.db = db;
        this.barangRepository = this.db.getRepository(barang_model_1.Barang);
        this.perusahaanRepository = this.db.getRepository(perusahaan_model_1.Perusahaan);
    }
    createPerusahaan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nama, alamat, no_telp, kode } = req.body;
            try {
                const existingPerusahaanByKode = yield this.perusahaanRepository.findOne({ where: { kode } });
                if (existingPerusahaanByKode) {
                    return response_utils_1.ResponseUtil.sendError(res, 400, 'Perusahaan with the same kode already exists', existingPerusahaanByKode);
                }
                const perusahaan = new perusahaan_model_1.Perusahaan(nama, no_telp, kode, alamat);
                if (!isCapitalThreeLetterString(kode)) {
                    return response_utils_1.ResponseUtil.sendError(res, 400, 'Kode must be a 3 capital letter string', perusahaan);
                }
                yield this.perusahaanRepository.save(perusahaan);
                return response_utils_1.ResponseUtil.sendResponse(res, 201, 'Perusahaan created successfully', perusahaan);
            }
            catch (error) {
                return response_utils_1.ResponseUtil.sendError(res, 500, 'Failed to create Perusahaan', req.body);
            }
        });
    }
    searchPerusahaan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { q } = req.query;
            try {
                const searchString = q === null || q === void 0 ? void 0 : q.toString();
                if (!searchString) {
                    //Return all perusahaan
                    const perusahaanData = yield this.perusahaanRepository.find();
                    return response_utils_1.ResponseUtil.sendResponse(res, 200, 'Perusahaan found', perusahaanData);
                }
                const perusahaanData = yield this.perusahaanRepository
                    .createQueryBuilder('perusahaan')
                    .where('perusahaan.nama LIKE :searchString OR perusahaan.kode LIKE :searchString', { searchString: `%${searchString}%` })
                    .getMany();
                if (perusahaanData.length === 0) {
                    return response_utils_1.ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.query);
                }
                return response_utils_1.ResponseUtil.sendResponse(res, 200, 'Perusahaan found', perusahaanData);
            }
            catch (error) {
                return response_utils_1.ResponseUtil.sendError(res, 500, 'Failed to search Perusahaan', req.query);
            }
        });
    }
    getPerusahaanById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const perusahaanEntity = yield (0, controller_utils_1.findPerusahaanById)(id, this.perusahaanRepository);
                if (!perusahaanEntity) {
                    return response_utils_1.ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.params);
                }
                return response_utils_1.ResponseUtil.sendResponse(res, 200, 'Perusahaan found', perusahaanEntity);
            }
            catch (error) {
                return response_utils_1.ResponseUtil.sendError(res, 500, 'Failed to get Perusahaan by id', req.params);
            }
        });
    }
    updatePerusahaan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const perusahaanEntity = yield (0, controller_utils_1.findPerusahaanById)(id, this.perusahaanRepository);
                if (!perusahaanEntity) {
                    return response_utils_1.ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.params);
                }
                const { nama, alamat, no_telp, kode } = req.body;
                if (!nama || !alamat || !no_telp || !kode) {
                    return response_utils_1.ResponseUtil.sendError(res, 400, 'Request body is incomplete', req.body);
                }
                perusahaanEntity.nama = nama;
                perusahaanEntity.alamat = alamat;
                perusahaanEntity.no_telp = no_telp;
                perusahaanEntity.kode = kode;
                yield this.perusahaanRepository.save(perusahaanEntity);
                return response_utils_1.ResponseUtil.sendResponse(res, 200, 'Perusahaan updated successfully', perusahaanEntity);
            }
            catch (error) {
                return response_utils_1.ResponseUtil.sendError(res, 500, 'Failed to update Perusahaan', req.params);
            }
        });
    }
    deletePerusahaanById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const perusahaanEntity = yield (0, controller_utils_1.findPerusahaanById)(id, this.perusahaanRepository);
                if (!perusahaanEntity) {
                    return response_utils_1.ResponseUtil.sendError(res, 404, 'Perusahaan not found', {
                        id: req.params.id,
                    });
                }
                yield this.barangRepository.delete({ perusahaan: perusahaanEntity });
                yield this.perusahaanRepository.delete(perusahaanEntity);
                return response_utils_1.ResponseUtil.sendResponse(res, 200, 'Perusahaan deleted successfully', perusahaanEntity);
            }
            catch (error) {
                return response_utils_1.ResponseUtil.sendError(res, 500, 'Failed to delete Perusahaan', {
                    id: req.params.id,
                });
            }
        });
    }
}
exports.PerusahaanController = PerusahaanController;
