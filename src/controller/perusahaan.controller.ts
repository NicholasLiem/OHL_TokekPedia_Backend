import { Request, Response } from 'express';
import { Perusahaan } from '../models/perusahaan.model';
import { DataSource } from 'typeorm';

function isCapitalThreeLetterString(str: string): boolean {
  const regex = /^[A-Z]{3}$/;
  return regex.test(str);
}

export const createPerusahaan = async (req: Request, res: Response, db: DataSource) => {
  const { nama, alamat, no_telp, kode } = req.body;
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
      });
    }

    // const existingPerusahaanByNama = await db.manager.findOne(Perusahaan, { where: { nama: nama } });
    // if (existingPerusahaanByNama) {
    //     return res.status(400).json({
    //         status: 'error',
    //         error: 'Perusahaan with the same nama already exists',
    //         data: {
    //             id: existingPerusahaanByNama.id,
    //             nama: existingPerusahaanByNama.nama,
    //             alamat: existingPerusahaanByNama.alamat,
    //             no_telp: existingPerusahaanByNama.no_telp,
    //             kode: existingPerusahaanByNama.kode
    //         }
    //     });
    // }

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
        });
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
    });
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
    });
  }
};

// export const clearDataPerusahaan(req: Request, res: Response, db: DataSource) => {
//     await db.manager.delete(Perusahaan, {});
//     res.status(200).json({
//         status: 'success',
//         message: 'Perusahaan data cleared successfully'
//     });
// }