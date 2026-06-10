import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../../enums/order.enums';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column('double precision')
  total: number;

  @Column({
    type: 'int',
    default: OrderStatus.NEW,
  })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (order_item) => order_item.order)
  orderItems: OrderItem[];
}
