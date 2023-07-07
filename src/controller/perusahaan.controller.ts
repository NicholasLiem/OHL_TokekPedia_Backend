import { Request, Response } from 'express';
import { Perusahaan } from '../models/perusahaan.model';
import { Barang } from '../models/barang.model';
import { DataSource } from 'typeorm';
import { findPerusahaanById } from '../utils/controller.utils';

function isCapitalThreeLetterString(str: string): boolean {
  const regex = /^[A-Z]{3}$/;
  return regex.test(str);
}

export const createPerusahaan = async (req: Request, res: Response, db: DataSource) => {
  const { nama, alamat, no_telp, kode } = req.body
  try {
    const existingPerusahaanByKode = await db.manager.findOne(Perusahaan, { where: { kode: kode } });
    if (existingPerusahaanByKode) {
      return res.status(400).json({
        status: 'error',
        error: 'Perusahaan with the same kode already exists',
        data: {
          id: existingPerusahaanByKode.id,
          nama: existingPerusahaanByKode.nama,
          alamat: existingPerusahaanByKode.alamat,
          no_telp: existingPerusahaanByKode.no_telp,
          kode: existingPerusahaanByKode.kode
        }
      })
    }

    const perusahaan = new Perusahaan(nama, no_telp, kode, alamat);
    if (!isCapitalThreeLetterString(kode)) {
        return res.status(400).json({
            status: 'error',
            error: 'Kode perusahaan has to be a three capital letter string',
            data: {
                id: null,
                nama: perusahaan.nama,
                alamat: perusahaan.alamat,
                no_telp: perusahaan.no_telp,
                kode: perusahaan.kode
            }
        })
    }
    
    await db.manager.save(perusahaan);

    res.status(201).json({
      status: 'success',
      message: 'Perusahaan created successfully',
      data: {
        id: perusahaan.id,
        nama: perusahaan.nama,
        alamat: perusahaan.alamat,
        no_telp: perusahaan.no_telp,
        kode: perusahaan.kode
      }
    })
  } catch (error) {
    console.error('Failed to create Perusahaan:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to create Perusahaan',
      data: {
        id: null,
        nama: nama,
        alamat: alamat,
        no_telp: no_telp,
        kode: kode
      }
    })
  }
}

export const getPerusahaanById = async (req: Request, res: Response, db: DataSource) => {
  const { id } = req.params
  try {
    const perusahaanEntity = await findPerusahaanById(id, db)
    if (perusahaanEntity == null){
      return res.status(404).json({
        status: 'error',
        message: 'Perusahaan not found',
        data: {
          id: id,
          nama: null,
          alamat: null,
          no_telp: null,
          kode: null
        }
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Perusahaan found',
      data: {
        id: perusahaanEntity.id,
        nama: perusahaanEntity.nama,
        alamat: perusahaanEntity.alamat,
        no_telp: perusahaanEntity.no_telp,
        kode: perusahaanEntity.kode
      }
    })
  } catch(error){ 
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get Perusahaan by id',
      data: {
        id: id,
        nama: null,
        alamat: null,
        no_telp: null,
        kode: null
      }
    })
  }
}

export const updatePerusahaan = async (req: Request, res: Response, db: DataSource) => {
  const { id } = req.params
  try{
    const perusahaanEntity = await findPerusahaanById(id, db)
    if (perusahaanEntity == null){
      return res.status(404).json({
        status: 'error',
        message: 'Perusahaan not found',
        data: {
          id: id,
          nama: null,
          alamat: null,
          no_telp: null,
          kode: null
        }
      })
    }

    const { nama, alamat, no_telp, kode } = req.body
    if (nama == null || alamat == null || no_telp == null || kode == null){
      return res.status(400).json({
        status: 'error',
        message: 'Every Perusahaan data must not be empty',
        data: {
          id: id,
          nama: nama,
          alamat: alamat,
          no_telp: no_telp,
          kode: kode
        }
      })
    }

    perusahaanEntity.nama = nama
    perusahaanEntity.alamat = alamat
    perusahaanEntity.no_telp = no_telp
    perusahaanEntity.kode = kode

    await db.manager.save(perusahaanEntity)
    return res.status(200).json({
      status: 'success',
      message: 'Perusahaan updated successfully',
      data: {
        id: perusahaanEntity.id,
        nama: perusahaanEntity.nama,
        alamat: perusahaanEntity.alamat,
        no_telp: perusahaanEntity.no_telp,
        kode: perusahaanEntity.kode
      }
    })

  } catch(error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update Perusahaan',
      data: {
        id: id,
        nama: null,
        alamat: null,
        no_telp: null,
        kode: null
      }
    })
  }
}

export const deletePerusahaanById = async (req: Request, res: Response, db: DataSource) => {
  const {id} = req.params
  try {
    const perusahaanEntity = await findPerusahaanById(id, db)
    if (perusahaanEntity == null){
      return res.status(404).json({
        status: 'error',
        message: 'Perusahaan not found',
        data: {
          id: id,
          nama: null,
          alamat: null,
          no_telp: null,
          kode: null
        }
      })
    }
    await db.manager.delete(Barang, {perusahaan: perusahaanEntity})
    await db.manager.delete(Perusahaan, id)
    return res.status(200).json({
      status: 'success',
      message: 'Perusahaan deleted successfully',
      data: {
        id: id,
        nama: perusahaanEntity.nama,
        alamat: perusahaanEntity.alamat,
        no_telp: perusahaanEntity.no_telp,
        kode: perusahaanEntity.kode
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete Perusahaan',
      data: {
        id: id,
        nama: null,
        alamat: null,
        no_telp: null,
        kode: null
      }
    })
  }
}