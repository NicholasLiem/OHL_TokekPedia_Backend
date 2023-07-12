import { Request, Response } from 'express';
import { Perusahaan } from '../models/perusahaan.model';
import { Barang } from '../models/barang.model';
import { DataSource, Repository } from 'typeorm';
import { findPerusahaanById } from '../utils/controller.utils';
import { ResponseUtil } from '../utils/response.utils';

function isCapitalThreeLetterString(str: string): boolean {
  const regex = /^[A-Z]{3}$/;
  return regex.test(str);
}

export class PerusahaanController {
  private barangRepository: Repository<Barang>;
  private perusahaanRepository: Repository<Perusahaan>;

  constructor(private db: DataSource) {
    this.barangRepository = this.db.getRepository(Barang);
    this.perusahaanRepository = this.db.getRepository(Perusahaan);
  }

  async createPerusahaan(req: Request, res: Response): Promise<Response> {
    const { nama, alamat, no_telp, kode } = req.body;

    try {
      const existingPerusahaanByKode = await this.perusahaanRepository.findOne({ where: { kode } });
      if (existingPerusahaanByKode) {
        return ResponseUtil.sendError(res, 400, 'Perusahaan with the same kode already exists', existingPerusahaanByKode);
      }

      const perusahaan = new Perusahaan(nama, no_telp, kode, alamat);

      if (!isCapitalThreeLetterString(kode)) {
        return ResponseUtil.sendError(res, 400, 'Kode must be a 3 capital letter string', perusahaan);
      }

      await this.perusahaanRepository.save(perusahaan);
      return ResponseUtil.sendResponse(res, 201, 'Perusahaan created successfully', perusahaan);
    } catch (error) {
      return ResponseUtil.sendError(res, 500, 'Failed to create Perusahaan', req.body);
    }
  }

  async searchPerusahaan(req: Request, res: Response): Promise<Response> {
    const { q } = req.query;

    try {
      const searchString = q?.toString();

      if (!searchString) {
        return ResponseUtil.sendError(res, 400, 'Search query is empty', req.query);
      }

      const perusahaanData = await this.perusahaanRepository
        .createQueryBuilder('perusahaan')
        .where('perusahaan.nama LIKE :searchString OR perusahaan.kode LIKE :searchString', { searchString: `%${searchString}%` })
        .getMany();

      if (perusahaanData.length === 0) {
        return ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.query);
      }

      return ResponseUtil.sendResponse(res, 200, 'Perusahaan found', perusahaanData);
    } catch (error) {
      return ResponseUtil.sendError(res, 500, 'Failed to search Perusahaan', req.query);
    }
  }

  async getPerusahaanById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const perusahaanEntity = await findPerusahaanById(id, this.perusahaanRepository);
      if (!perusahaanEntity) {
        return ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.params);
      }

      return ResponseUtil.sendResponse(res, 200, 'Perusahaan found', perusahaanEntity);
    } catch (error) {
      return ResponseUtil.sendError(res, 500, 'Failed to get Perusahaan by id', req.params);
    }
  }

  async updatePerusahaan(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const perusahaanEntity = await findPerusahaanById(id, this.perusahaanRepository);

      if (!perusahaanEntity) {
        return ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.params);
      }

      const { nama, alamat, no_telp, kode } = req.body;
      if (!nama || !alamat || !no_telp || !kode) {
        return ResponseUtil.sendError(res, 400, 'Request body is incomplete', req.body);
      }

      perusahaanEntity.nama = nama;
      perusahaanEntity.alamat = alamat;
      perusahaanEntity.no_telp = no_telp;
      perusahaanEntity.kode = kode;

      await this.perusahaanRepository.save(perusahaanEntity);
      return ResponseUtil.sendResponse(res, 200, 'Perusahaan updated successfully', perusahaanEntity);
    } catch (error) {
      return ResponseUtil.sendError(res, 500, 'Failed to update Perusahaan', req.params);
    }
  }

  async deletePerusahaanById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const perusahaanEntity = await findPerusahaanById(id, this.perusahaanRepository);

      if (!perusahaanEntity) {
        return ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.params);
      }

      await this.barangRepository.delete({ perusahaan: perusahaanEntity });
      await this.perusahaanRepository.delete(perusahaanEntity);

      return ResponseUtil.sendResponse(res, 200, 'Perusahaan deleted successfully', perusahaanEntity);
    } catch (error) {
      return ResponseUtil.sendError(res, 500, 'Failed to delete Perusahaan', req.params);
    }
  }
}
