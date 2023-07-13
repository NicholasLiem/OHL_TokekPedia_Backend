import { Request, Response } from 'express';
import { Barang } from '../models/barang.model';
import { Perusahaan } from '../models/perusahaan.model';
import { DataSource, Repository } from 'typeorm';
import { findBarangById, findPerusahaanById, findPerusahaanByName } from '../utils/controller.utils';
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

      const barangEntity = await this.barangRepository.findOne({ where: { kode: kode } });
      if (barangEntity) {
        return ResponseUtil.sendError(res, 400, 'Barang with the code given already exists', barangEntity);
      }

      // Kasus ketika perusahaan_id is name instead of UUID
      // Bug: Harusnya Fixed sih sekarang
      const perusahaanEntityByName = await findPerusahaanByName(perusahaan_id, this.perusahaanRepository);
      if (perusahaanEntityByName) {
        const barang = new Barang(nama, harga, stok, perusahaanEntityByName, kode);
        await this.barangRepository.save(barang);
        return ResponseUtil.sendResponseBarang(res, 201, 'Barang created successfully', barang);
      }

      const perusahaanEntity = await findPerusahaanById(perusahaan_id, this.perusahaanRepository);
      if (!perusahaanEntity) {
        return ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.body);
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

      // Return all if both null
      if (!searchString && !perusahaanString) {
        const barangData = await this.barangRepository
          .createQueryBuilder('barang')
          .leftJoinAndSelect('barang.perusahaan', 'perusahaan')
          .getMany();
        return ResponseUtil.sendResponseBarangArray(res, 200, 'Barang found', barangData);
      }
      
      // Case: Perusahaan Name given & Search String null
      if (perusahaanString && !searchString) {
        const perusahaanEntity = await findPerusahaanByName(perusahaanString, this.perusahaanRepository);
        if (!perusahaanEntity) {
          return ResponseUtil.sendError(res, 404, 'Perusahaan not found', req.query);
        }

        const barangData = await this.barangRepository
          .createQueryBuilder('barang')
          .leftJoinAndSelect('barang.perusahaan', 'perusahaan')
          .where('perusahaan.nama = :perusahaanString', { perusahaanString })
          .getMany();

        return ResponseUtil.sendResponseBarangArray(res, 200, 'Barang found', barangData);
      }

      // Case: Search String given & Perusahaan Name null
      if (!perusahaanString && searchString) {
        const barangData = await this.barangRepository
          .createQueryBuilder('barang')
          .leftJoinAndSelect('barang.perusahaan', 'perusahaan')
          .where('barang.nama LIKE :searchString OR barang.kode LIKE :searchString', { searchString: `%${searchString}%` })
          .getMany();
        return ResponseUtil.sendResponseBarangArray(res, 200, 'Barang found', barangData);
      }

      // Case: Both given
      const barangData = await this.barangRepository
        .createQueryBuilder('barang')
        .leftJoinAndSelect('barang.perusahaan', 'perusahaan')
        .where('barang.nama LIKE :searchString OR barang.kode LIKE :searchString', { searchString: `%${searchString}%` })
        .andWhere('perusahaan.id = :perusahaanString', { perusahaanString })
        .getMany();

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

      const barangWithSameKode = await this.barangRepository.findOne({ where: { kode, perusahaan: perusahaanEntity } });
      if (barangWithSameKode && barangWithSameKode.id !== barangEntity.id) {
        return ResponseUtil.sendError(res, 400, 'Barang with the code given already exists', barangWithSameKode);
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
        return ResponseUtil.sendError(res, 404, 'Barang not found', null);
      }
  
      await this.barangRepository.delete(barangEntity);
      console.log('barangEntity:', barangEntity);
      return ResponseUtil.sendResponseBarang(res, 200, 'Barang deleted successfully', barangEntity);
    } catch (error) {
      console.log(error);
      return ResponseUtil.sendError(res, 500, 'Failed to delete Barang', null);
    }
  }
}