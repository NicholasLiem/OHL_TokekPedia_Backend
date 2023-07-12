import { Request, Response } from 'express';
import { Perusahaan } from '../models/perusahaan.model';
import { Barang } from '../models/barang.model';
import { DataSource } from 'typeorm';
import { findPerusahaanById } from '../utils/controller.utils';
import { ResponseUtil } from '../utils/response.utils';

function isCapitalThreeLetterString(str: string): boolean {
  const regex = /^[A-Z]{3}$/;
  return regex.test(str);
}

export const createPerusahaan = async (req: Request, res: Response, db: DataSource) => {
  const { nama, alamat, no_telp, kode } = req.body
  try {

    const existingPerusahaanByKode = await db.manager.findOne(Perusahaan, { where: { kode: kode } })

    if (existingPerusahaanByKode)
      return ResponseUtil.sendError(res, 400, 'Perusahaan with the same kode already exists', existingPerusahaanByKode)

    const perusahaan = new Perusahaan(nama, no_telp, kode, alamat)

    if (!isCapitalThreeLetterString(kode))
      return ResponseUtil.sendError(res, 400, 'Kode must be a 3 capital letter string', perusahaan)
    
    
    await db.manager.save(perusahaan);

    return ResponseUtil.sendResponse(res, 201, 'Perusahaan created successfully', perusahaan)

  } catch (error) {

    return ResponseUtil.sendError(res, 500, 'Failed to create Perusahaan', req.body)
  }
}

export const searchPerusahaan = async (req: Request, res: Response, db: DataSource) => {
  const { q } = req.query
  try {
    const perusahaanRepository = db.getRepository(Perusahaan)
    const searchString = q?.toString()

    if (!q)
      return ResponseUtil.sendError(res, 400, 'Search query is empty', req.query)

    var perusahaanData = await perusahaanRepository
                      .createQueryBuilder('perusahaan')
                      .where('perusahaan.nama LIKE :searchString OR perusahaan.kode LIKE :searchString', {searchString: `%${searchString}%`})
                      .getMany()

    if (perusahaanData.length == 0)
      return ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.query)

    return ResponseUtil.sendResponse(res, 200, 'Perusahaan found', perusahaanData)

  } catch (error) {

    return ResponseUtil.sendError(res, 500, 'Failed to search Perusahaan', req.query)
  }
}

export const getPerusahaanById = async (req: Request, res: Response, db: DataSource) => {
  const { id } = req.params
  try {
    const perusahaanEntity = await findPerusahaanById(id, db)
    if (perusahaanEntity == null)
      return ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.params)

    return ResponseUtil.sendResponse(res, 200, 'Perusahaan found', perusahaanEntity)

  } catch(error){ 

    return ResponseUtil.sendError(res, 500, 'Failed to get Perusahaan by id', req.params)
  }
}

export const updatePerusahaan = async (req: Request, res: Response, db: DataSource) => {
  const { id } = req.params
  try{
    const perusahaanEntity = await findPerusahaanById(id, db)
    if (perusahaanEntity == null)
      return ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.params)

    const { nama, alamat, no_telp, kode } = req.body
    if (nama == null || alamat == null || no_telp == null || kode == null)
      return ResponseUtil.sendError(res, 400, 'Request body is incomplete', req.body)

    perusahaanEntity.nama = nama
    perusahaanEntity.alamat = alamat
    perusahaanEntity.no_telp = no_telp
    perusahaanEntity.kode = kode

    await db.manager.save(perusahaanEntity)

    return ResponseUtil.sendResponse(res, 200, 'Perusahaan updated successfully', perusahaanEntity)

  } catch(error) {
      
    return ResponseUtil.sendError(res, 500, 'Failed to update Perusahaan', req.params)
  }
}

export const deletePerusahaanById = async (req: Request, res: Response, db: DataSource) => {
  const {id} = req.params
  try {
    const perusahaanEntity = await findPerusahaanById(id, db)
    if (perusahaanEntity == null)
      return ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.params)
    
    await db.manager.delete(Barang, {perusahaan: perusahaanEntity})
    await db.manager.delete(Perusahaan, id)

    return ResponseUtil.sendResponse(res, 200, 'Perusahaan deleted successfully', perusahaanEntity)
  } catch (error) {
      
    return ResponseUtil.sendError(res, 500, 'Failed to delete Perusahaan', req.params)
  }
}