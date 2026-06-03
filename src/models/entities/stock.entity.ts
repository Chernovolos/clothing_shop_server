import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Color } from './color.entity';
import { Product } from './product.entity';
import { ProductSize } from '../../enums/product.enums';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'product_id', nullable: true })
  productId: number | null;

  @Column('int', { name: 'color_id', nullable: true })
  colorId: number | null;

  @Column({
    type: 'int',
    name: 'product_size',
    default: ProductSize.DEFAULT,
  })
  productSize: ProductSize;

  @Column('int')
  available: number;

  @ManyToOne(() => Color, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'color_id' })
  color: Color;

  @ManyToOne(() => Product, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
