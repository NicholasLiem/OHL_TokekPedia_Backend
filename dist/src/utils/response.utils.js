"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static sendResponse(res, status, message, data) {
        return res.status(status).json({
            status: 'success',
            message: message,
            data: data
        });
    }
    static sendResponseBarang(res, status, message, data) {
        return res.status(status).json({
            status: 'success',
            message: message,
            data: {
                id: data.id,
                nama: data.nama,
                harga: data.harga,
                stok: data.stok,
                perusahaan_id: data.perusahaan.id,
                kode: data.kode
            }
        });
    }
    static sendResponseBarangArray(res, status, message, data) {
        return res.status(status).json({
            status: 'success',
            message: message,
            data: data.map((barang) => {
                return {
                    id: barang.id,
                    nama: barang.nama,
                    harga: barang.harga,
                    stok: barang.stok,
                    perusahaan_id: barang.perusahaan.id,
                    kode: barang.kode
                };
            })
        });
    }
    static sendError(res, status, message, data) {
        return res.status(status).json({
            status: 'error',
            message: message,
            data: data
        });
    }
}
exports.ResponseUtil = ResponseUtil;
