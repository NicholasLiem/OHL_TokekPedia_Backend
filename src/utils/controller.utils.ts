import { DataSource } from "typeorm";
import { Barang } from "../models/barang.model";
import { Perusahaan } from "../models/perusahaan.model";

export const findBarangById = async (id: string, db: DataSource) => {
    try {
        const barangEntity = await db.manager.findOne(Barang, { where: { id: id }, relations: ['perusahaan'] })
        return barangEntity
    } catch (error) {
        console.error('Failed to find Barang by id:', error)
        return null;
    }
}

export const findPerusahaanById = async (id: string, db: DataSource) => {

    try {
        const perusahaanEntity = await db.manager.findOne(Perusahaan, { where: { id: id } })
        return perusahaanEntity
    } catch (error) {
        console.error('Failed to find Perusahaan by id:', error)
        return null
    }
}

export const findPerusahaanByName = async (nama: string, db: DataSource) => {
    try {
        const perusahaanEntity = await db.manager.findOne(Perusahaan, { where: { nama: nama } })
        return perusahaanEntity
    } catch (error) {
        console.error('Failed to find Perusahaan by nama:', error)
        return null
    }
}