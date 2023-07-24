import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Check } from 'typeorm';
import { Perusahaan } from './perusahaan.model';

@Entity()
@Check(`"harga" > 0`)
@Check(`"stok" >= 0`)
export class Barang {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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
    this.harga = Math.max(harga, 0);
    this.stok = Math.max(stok, 0);
    this.perusahaan = perusahaan;
    this.kode = kode;
  }
}
