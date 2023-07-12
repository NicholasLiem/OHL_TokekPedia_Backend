import { Request, Response } from 'express'
import { Barang } from '../models/barang.model'
import { DataSource } from 'typeorm';
import { findBarangById, findPerusahaanById } from '../utils/controller.utils';
import { ResponseUtil } from '../utils/response.utils';

export const createBarang = async (req: Request, res: Response, db: DataSource) => {
    const { nama, harga, stok, perusahaan_id, kode } = req.body
    try {
        const perusahaanEntity = await findPerusahaanById(perusahaan_id, db)

        if (!perusahaanEntity) {
          return ResponseUtil.sendError(res, 500, 'Perusahaan not found', req.body)
        }

        const barangEntity = await db.manager.findOne(Barang, { where: { kode: kode } })

        if (barangEntity) {
          return ResponseUtil.sendError(res, 500, 'Barang with the code given already exist', barangEntity)
        }

        const barang = new Barang(nama, harga, stok, perusahaanEntity, kode)
        await db.manager.save(barang)

        return ResponseUtil.sendResponseBarang(res, 201, 'Barang created successfully', barang)

    } catch (error) {

        return ResponseUtil.sendError(res, 500, 'Failed to create Barang', req.body)
    }
}

export const getBarang = async (req: Request, res: Response, db: DataSource) => {
    const { id } = req.params;
    try {
      const barangEntity = await findBarangById(id, db)

      if (!barangEntity) {
        return ResponseUtil.sendError(res, 500, 'Barang not found', req.params)
      }

      return ResponseUtil.sendResponseBarang(res, 200, 'Barang found', barangEntity)

    } catch (error) {

      return ResponseUtil.sendError(res, 500, 'Failed to get Barang', req.params)
    }
}


export const searchBarang = async (req: Request, res: Response, db: DataSource) => {
  const { q, perusahaan } = req.query;
  try {
    const barangRepository = db.getRepository(Barang);
    const searchString = q?.toString();
    const perusahaanString = perusahaan?.toString();

    var barangData = await barangRepository
                  .createQueryBuilder('barang')
                  .leftJoinAndSelect('barang.perusahaan', 'perusahaan')
                  .where('barang.nama LIKE :searchString OR barang.kode LIKE :searchString', { searchString: `%${searchString}%` })
                  .andWhere('perusahaan.id = :perusahaanString', { perusahaanString: perusahaanString })
                  .getMany()

    if (barangData.length === 0) {
      return ResponseUtil.sendError(res, 404, 'Barang not found', [])
    }

    return ResponseUtil.sendResponseBarangArray(res, 200, 'Barang found', barangData)

  } catch (error) {

    return ResponseUtil.sendError(res, 500, 'Failed to search barang', [])
  }
}


export const updateBarang = async (req: Request, res: Response, db: DataSource) => {
    const { id } = req.params
    const { nama, harga, stok, perusahaan_id, kode } = req.body

    try {
      const barangEntity = await findBarangById(id, db)
  
      if (barangEntity == null) {
        return ResponseUtil.sendError(res, 500, 'Barang not found', req.params)
      }
  
      const perusahaanEntity = await findPerusahaanById(perusahaan_id, db)
  
      if (!perusahaanEntity) {
        return ResponseUtil.sendError(res, 500, 'Perusahaan not found', req.body)
      }

      if (nama == null || harga == null || stok == null || kode == null) {
        return ResponseUtil.sendError(res, 500, 'Barang data is not complete', req.body)
      }
      
      barangEntity.nama = nama;
      barangEntity.harga = harga;
      barangEntity.stok = stok;
      barangEntity.perusahaan = perusahaanEntity;
      barangEntity.kode = kode;
  
      await db.manager.save(barangEntity);

      return ResponseUtil.sendResponseBarang(res, 200, 'Barang updated successfully', barangEntity)

    } catch (error) {

      return ResponseUtil.sendError(res, 500, 'Failed to update Barang', req.body)
    }
}

export const deleteBarangById = async (req: Request, res: Response, db: DataSource) => {
    const { id } = req.params
    try {
      const barangEntity = await findBarangById(id, db)
  
      if (!barangEntity) {
        return ResponseUtil.sendError(res, 500, 'Barang not found', req.params)
      }
  
      await db.manager.remove(barangEntity)

      return ResponseUtil.sendResponseBarang(res, 200, 'Barang deleted successfully', barangEntity)
  
    } catch (error) {
    
        return ResponseUtil.sendError(res, 500, 'Failed to delete Barang', req.params) 
    }
}