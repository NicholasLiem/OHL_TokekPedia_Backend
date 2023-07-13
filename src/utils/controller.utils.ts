import { Repository } from "typeorm";
import { Barang } from "../models/barang.model";
import { Perusahaan } from "../models/perusahaan.model";

export const findBarangById = async (id: string, db: Repository<Barang>) => {
    try {
        const barangEntity = await db
            .createQueryBuilder('barang')
            .leftJoinAndSelect('barang.perusahaan', 'perusahaan')
            .where('barang.id = :id', { id })
            .getOne();
        return barangEntity
    } catch (error) {
        console.error('Failed to find Barang by id:', error)
        return null;
    }
}

export const findPerusahaanById = async (id: string, db: Repository<Perusahaan>) => {

    try {
        const perusahaanEntity = await db.findOne({ where: { id: id } })
        return perusahaanEntity
    } catch (error) {
        console.error('Failed to find Perusahaan by id:', error)
        return null
    }
}

export const findPerusahaanByName = async (nama: string, db: Repository<Perusahaan>) => {
    try {
        const perusahaanEntity = await db.findOne({ where: { nama: nama } })
        return perusahaanEntity
    } catch (error) {
        console.error('Failed to find Perusahaan by nama:', error)
        return null
    }
}