import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Image } from './image.entity';
import { Stock } from './stock.entity';
import { Tag } from './tag.entity';
import {
  ProductCategory,
  ProductSubType,
  ProductType,
} from '../../enums/product.enums';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 127 })
  title: string;

  @Column({
    type: 'int',
    name: 'category_type',
    default: ProductCategory.DEFAULT,
  })
  categoryType: ProductCategory;

  @Column('text')
  description: string;

  @Column('double precision')
  price: number;

  @Column({
    type: 'int',
    default: ProductType.DEFAULT,
  })
  type: ProductType;

  @Column({
    type: 'int',
    name: 'sub_type',
    default: ProductSubType.DEFAULT,
  })
  subType: ProductSubType;

  @OneToMany(() => Image, (image) => image.product, { eager: true })
  images: Image[];

  @OneToMany(() => Stock, (stock) => stock.product, { eager: true })
  stocks: Stock[];

  @ManyToMany(() => Tag, { eager: true })
  @JoinTable({
    name: 'product_tags',
    joinColumn: { name: 'product_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Tag[];
}
