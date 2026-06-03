import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Color } from './color.entity';
import { Product } from './product.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'product_id' })
  productId: number;

  @Column('int', { name: 'color_id' })
  colorId: number;

  @Column('text')
  url: string;

  @Column('varchar', { length: 127 })
  title: string;

  @Column('boolean', { default: false, name: 'is_primary' })
  isPrimary: boolean;

  @ManyToOne(() => Color, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'color_id' })
  color: Color;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
