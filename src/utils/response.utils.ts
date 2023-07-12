import { Response } from 'express'
import { Barang } from '../models/barang.model'

export class ResponseUtil {
    static sendResponse<T>(
        res: Response, 
        status: number, 
        message: string, 
        data: T) : Response<T> 
        {
            return res.status(status).json({
                status: 'success',
                message: message,
                data: data
            })
        }
    
    static sendResponseBarang<T extends Barang>(
        res: Response,
        status: number,
        message: string,
        data: T) : Response<T>
        {
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
            })
        }

    static sendResponseBarangArray<T extends Barang>(
        res: Response,
        status: number,
        message: string,
        data: T[]) : Response<T[]>
        {
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
                    }
                })
            })
        }

    static sendError<T>(
        res: Response,
        status: number,
        message: string,
        data: T) : Response<T>
        {
            return res.status(status).json({
                status: 'error',
                message: message,
                data: data
            })
        }
    }