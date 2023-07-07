import { Request, Response } from 'express'
import { Barang } from '../models/barang.model'
import { Perusahaan } from '../models/perusahaan.model'
import { DataSource, FindOperator, ILike } from 'typeorm';

// Utils
const findBarangById = async (id: string, db: DataSource) => {
    try {
        const barangEntity = await db.manager.findOne(Barang, { where: { id: id }, relations: ['perusahaan'] })
        return barangEntity
    } catch (error) {
        console.error('Failed to find Barang by id:', error)
        return null;
    }
}

const findPerusahaanById = async (id: string, db: DataSource) => {

    try {
        const perusahaanEntity = await db.manager.findOne(Perusahaan, { where: { id: id } })
        return perusahaanEntity
    } catch (error) {
        console.error('Failed to find Perusahaan by id:', error)
        return null
    }
}

const findPerusahaanByName = async (nama: string, db: DataSource) => {
    try {
        const perusahaanEntity = await db.manager.findOne(Perusahaan, { where: { nama: nama } })
        return perusahaanEntity
    } catch (error) {
        console.error('Failed to find Perusahaan by nama:', error)
        return null
    }
}

// Main functions

export const createBarang = async (req: Request, res: Response, db: DataSource) => {
    const { nama, harga, stok, perusahaan_id, kode } = req.body

    try {
        const perusahaanEntity = await findPerusahaanById(perusahaan_id, db)

        if (!perusahaanEntity) {
            return res.status(500).json({ 
              status: 'error',
              message: 'Perusahaan not found',
              data: {
                  id: null,
                  nama: nama,
                  harga: harga,
                  stok: stok,
                  kode: kode,
                  perusahaan_id: perusahaan_id
              }
          })
        }

        const barangEntity = await db.manager.findOne(Barang, { where: { kode: kode } })
        if (barangEntity) {
            return res.status(500).json({ 
              status: 'error',
              message: 'Barang with the code given already exist',
              data: {
                  id: null,
                  nama: nama,
                  harga: harga,
                  stok: stok,
                  kode: kode,
                  perusahaan_id: perusahaan_id
              }
          })
        }
    
        const barang = new Barang(nama, harga, stok, perusahaanEntity, kode)
    
        await db.manager.save(barang)
    
        res.status(201).json({ 
            status: 'success',
            message: 'Barang created successfully',
            data: {
                id: barang.id,
                nama: barang.nama,
                harga: barang.harga,
                stok: barang.stok,
                kode: barang.kode,
                perusahaan_id: perusahaan_id
            } })

    } catch (error) {
        console.error('Failed to create Barang:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Failed to create Barang',
            data: {
                id: null,
                nama: nama,
                harga: harga,
                stok: stok,
                kode: kode,
                perusahaan_id: perusahaan_id
            }
        })
    }
}

export const getBarang = async (req: Request, res: Response, db: DataSource) => {
    const { id } = req.params;
    try {
      const barangEntity = await findBarangById(id, db)
  
      if (!barangEntity) {
        return res.status(400).json({
          status: 'error',
          message: 'Failed to find barang',
          data: {
            id: id,
            nama: null,
            harga: null,
            stok: null,
            kode: null,
            perusahaan_id: null
          }
        })
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Barang found',
        data: {
          id: barangEntity.id,
          nama: barangEntity.nama,
          harga: barangEntity.harga,
          stok: barangEntity.stok,
          kode: barangEntity.kode,
          perusahaan_id: barangEntity.perusahaan.id
        }
      })
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to find barang',
        data: {
          id: id,
          nama: null,
          harga: null,
          stok: null,
          kode: null,
          perushaan_id: null
        }
      })
    }
}


// export const searchBarang = async (req: Request, res: Response, db: DataSource) => {
//   const { q, perusahaan } = req.query;
//   try {
//     const whereCondition: {
//       nama?: string;
//       kode?: string;
//       perusahaan?: string;
//     } = {};

//     if (q) {
//       whereCondition.nama = q.toString();
//       whereCondition.kode = q.toString();
//     }

//     if (perusahaan) {
//       whereCondition.perusahaan = perusahaan.toString();
//     }

//     const barangs = await db.manager.find(Barang, {
//       where: whereCondition,
//       relations: ['perusahaan'],
//     });

//     res.status(200).json({
//       status: 'success',
//       message: 'Barang found',
//       data: barangs.map((barang) => ({
//         id: barang.id,
//         nama: barang.nama,
//         harga: barang.harga,
//         stok: barang.stok,
//         kode: barang.kode,
//         perusahaan_id: barang.perusahaan.id,
//       })),
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Failed to search barang',
//       data: [],
//     });
//   }
// }


export const updateBarang = async (req: Request, res: Response, db: DataSource) => {
    const { id } = req.params
    const { nama, harga, stok, perusahaan_id, kode } = req.body

    try {
      const barangEntity = await findBarangById(id, db)
  
      if (barangEntity == null) {
        return res.status(400).json({
          status: 'error',
          message: 'Failed to find barang',
          data: {
            id: id,
            nama: null,
            harga: null,
            stok: null,
            kode: null,
            perusahaan_id: null
          }
        })
      }
  
      const perusahaanEntity = await findPerusahaanById(perusahaan_id, db)
  
      if (!perusahaanEntity) {
        return res.status(400).json({
            status: 'error',
            message: 'Perusahaan not found',
            data: {
              id: id,
              nama: nama,
              harga: harga,
              stok: stok,
              kode: kode,
              perusahaan_id: perusahaan_id
            }
          })
      }
      
      barangEntity.nama = nama;
      barangEntity.harga = harga;
      barangEntity.stok = stok;
      barangEntity.perusahaan = perusahaanEntity;
      barangEntity.kode = kode;
  
      await db.manager.save(barangEntity);
  
      res.status(200).json({
        status: 'success',
        message: 'Barang updated successfully',
        data: {
          id: barangEntity.id,
          nama: barangEntity.nama,
          harga: barangEntity.harga,
          stok: barangEntity.stok,
          kode: barangEntity.kode,
          perusahaan: barangEntity.perusahaan.id
        }
      })

    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to update barang',
        data: {
          id: id,
          nama: null,
          harga: null,
          stok: null,
          kode: null,
          perusahaan_id: null
        }
      });
    }
}

export const deleteBarangById = async (req: Request, res: Response, db: DataSource) => {
    const { id } = req.params
    try {
      const barangEntity = await findBarangById(id, db)
  
      if (!barangEntity) {
        return res.status(400).json({
          status: 'error',
          message: 'Failed to find barang',
          data: {
            id: id,
            nama: null,
            harga: null,
            stok: null,
            kode: null,
            perusahaan_id: null
          }
        })
      }
  
      await db.manager.remove(barangEntity)
  
      res.status(200).json({
        status: 'success',
        message: 'Barang deleted successfully',
        data: {
          id: barangEntity.id,
          nama: barangEntity.nama,
          harga: barangEntity.harga,
          stok: barangEntity.stok,
          kode: barangEntity.kode,
          perusahaan_id: barangEntity.perusahaan.id
        }
      })
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete barang',
        data: {
          id: id,
          nama: null,
          harga: null,
          stok: null,
          kode: null,
          perusahaan_id: null
        }
      })
    }
}