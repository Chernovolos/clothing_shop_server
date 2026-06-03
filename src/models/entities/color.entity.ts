import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('colors')
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 127 })
  code: string;

  @Column('varchar', { length: 7 })
  hex: string;
}
