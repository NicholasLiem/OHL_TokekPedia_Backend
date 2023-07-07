import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Barang } from './barang.model';

@Entity()
export class Perusahaan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nama: string;

  @Column()
  alamat: string;

  @Column()
  no_telp: string;

  @Column()
  kode: string

  @OneToMany(() => Barang, barang => barang.perusahaan)
  barangs: Barang[] | undefined;

  constructor(nama: string, no_telp: string, kode:string, alamat: string) {
    this.nama = nama;
    this.no_telp = no_telp;
    this.kode = kode;
    this.alamat = alamat;
  }
}