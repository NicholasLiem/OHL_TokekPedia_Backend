import { Request, Response } from 'express';
import { Barang } from '../models/barang.model';
import { Perusahaan } from '../models/perusahaan.model';
import { DataSource, Repository } from 'typeorm';
import { findBarangById, findPerusahaanById } from '../utils/controller.utils';
import { ResponseUtil } from '../utils/response.utils';

export class BarangController {
  private barangRepository: Repository<Barang>;
  private perusahaanRepository: Repository<Perusahaan>;

  constructor(private db: DataSource) {
    this.barangRepository = this.db.getRepository(Barang);
    this.perusahaanRepository = this.db.getRepository(Perusahaan);
  }

  async createBarang(req: Request, res: Response): Promise<Response> {
    const { nama, harga, stok, perusahaan_id, kode } = req.body;

    try {
      const perusahaanEntity = await findPerusahaanById(perusahaan_id, this.perusahaanRepository);
      if (!perusahaanEntity) {
        return ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.body);
      }

      const barangEntity = await this.barangRepository.findOne({ where: { kode, perusahaan: perusahaanEntity } });
      if (barangEntity) {
        return ResponseUtil.sendError(res, 400, 'Barang with the code given already exists', barangEntity);
      }

      const barang = new Barang(nama, harga, stok, perusahaanEntity, kode);
      await this.barangRepository.save(barang);

      return ResponseUtil.sendResponseBarang(res, 201, 'Barang created successfully', barang);
    } catch (error) {
      return ResponseUtil.sendError(res, 500, 'Failed to create Barang', req.body);
    }
  }

  async getBarang(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const barangEntity = await findBarangById(id, this.barangRepository);
      if (!barangEntity) {
        return ResponseUtil.sendError(res, 404, 'Barang not found', req.params);
      }

      return ResponseUtil.sendResponseBarang(res, 200, 'Barang found', barangEntity);
    } catch (error) {
      return ResponseUtil.sendError(res, 500, 'Failed to get Barang', req.params);
    }
  }

  async searchBarang(req: Request, res: Response): Promise<Response> {
    const { q, perusahaan } = req.query;

    try {
      const searchString = q?.toString();
      const perusahaanString = perusahaan?.toString();

      const barangData = await this.barangRepository
        .createQueryBuilder('barang')
        .leftJoinAndSelect('barang.perusahaan', 'perusahaan')
        .where('barang.nama LIKE :searchString OR barang.kode LIKE :searchString', { searchString: `%${searchString}%` })
        .andWhere('perusahaan.id = :perusahaanString', { perusahaanString })
        .getMany();

      if (barangData.length === 0) {
        return ResponseUtil.sendError(res, 404, 'Barang not found', []);
      }

      return ResponseUtil.sendResponseBarangArray(res, 200, 'Barang found', barangData);
    } catch (error) {
      return ResponseUtil.sendError(res, 500, 'Failed to search barang', []);
    }
  }

  async updateBarang(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { nama, harga, stok, perusahaan_id, kode } = req.body;

    try {
      const barangEntity = await findBarangById(id, this.barangRepository);
      if (!barangEntity) {
        return ResponseUtil.sendError(res, 404, 'Barang not found', req.params);
      }

      const perusahaanEntity = await findPerusahaanById(perusahaan_id, this.perusahaanRepository);
      if (!perusahaanEntity) {
        return ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.body);
      }

      if (!nama || !harga || !stok || !kode) {
        return ResponseUtil.sendError(res, 400, 'Barang data is not complete', req.body);
      }

      barangEntity.nama = nama;
      barangEntity.harga = harga;
      barangEntity.stok = stok;
      barangEntity.perusahaan = perusahaanEntity;
      barangEntity.kode = kode;

      await this.barangRepository.save(barangEntity);
      return ResponseUtil.sendResponseBarang(res, 200, 'Barang updated successfully', barangEntity);
    } catch (error) {
      return ResponseUtil.sendError(res, 500, 'Failed to update Barang', req.body);
    }
  }

  async deleteBarangById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const barangEntity = await findBarangById(id, this.barangRepository);
      if (!barangEntity) {
        return ResponseUtil.sendError(res, 404, 'Barang not found', req.params);
      }

      await this.barangRepository.remove(barangEntity);
      return ResponseUtil.sendResponseBarang(res, 200, 'Barang deleted successfully', barangEntity);
    } catch (error) {
      return ResponseUtil.sendError(res, 500, 'Failed to delete Barang', req.params);
    }
  }
}