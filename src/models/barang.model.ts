import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Perusahaan } from './perusahaan.model';

@Entity()
export class Barang {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nama: string;

  @Column()
  harga: number;

  @Column()
  stok: number;

  @ManyToOne(() => Perusahaan, perusahaan => perusahaan.barangs)
  perusahaan: Perusahaan;

  @Column()
  kode: string

  constructor(nama: string, harga: number, stok: number, perusahaan: Perusahaan, kode: string) {
    this.nama = nama;
    this.harga = harga;
    this.stok = stok;
    this.perusahaan = perusahaan;
    this.kode = kode;
  }
}
