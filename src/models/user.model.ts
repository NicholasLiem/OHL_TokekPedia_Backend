import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  password: string;

  constructor(username: string, password: string, name: string) {
    this.username = username;
    this.password = password;
    this.name = name;
  }
}
