import { Request, Response } from 'express';
import { Barang } from '../models/barang.model';
import { Perusahaan } from '../models/perusahaan.model';
import { DataSource } from 'typeorm';

export const createBarang = async (req: Request, res: Response, db: DataSource) => {
    const { nama, harga, stok, perusahaan, kode } = req.body;

    try {
        const perusahaanEntity = await db.manager.findOne(Perusahaan, { where: { nama: perusahaan } });

        if (!perusahaanEntity) {
            return res.status(400).json({ error: 'Perusahaan not found' });
        }
    
        const barang = new Barang(nama, harga, stok, perusahaanEntity, kode);
    
        await db.manager.save(barang);
    
        res.status(201).json({ 
            status: 'success',
            message: 'Barang created successfully',
            data: {
                id: barang.id,
                nama: barang.nama,
                harga: barang.harga,
                stok: barang.stok,
                kode: barang.kode,
                perusahaan_id: barang.perusahaan.id
            } });
    } catch (error) {
        console.error('Failed to create Barang:', error);
        res.status(500).json({ 
            status: 'failed',
            message: 'Failed to create Barang',
            data: {
                id: null,
                nama: nama,
                harga: harga,
                stok: stok,
                kode: kode,
                nama_perusahaan : perusahaan
            }
        });
    }
}
