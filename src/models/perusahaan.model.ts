import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Barang } from './barang.model';

@Entity()
export class Perusahaan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nama: string;

  @Column()
  alamat: string;

  @Column()
  no_telp: string;

  @Column({nullable: false, unique: true})
  kode: string

  @OneToMany(() => Barang, barang => barang.perusahaan, {cascade: true})
  barangs: Barang[] | undefined;

  constructor(nama: string, no_telp: string, kode:string, alamat: string) {
    this.nama = nama;
    this.no_telp = no_telp;
    this.kode = kode;
    this.alamat = alamat;
  }
}
