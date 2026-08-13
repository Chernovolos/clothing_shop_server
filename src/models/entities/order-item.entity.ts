import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItemType } from '../../enums/order.enums';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    enum: OrderItemType,
    default: OrderItemType.PRODUCT,
  })
  type: OrderItemType;

  @Column({
    type: 'int',
    name: 'product_id',
  })
  productId: number;

  @Column({
    type: 'int',
    name: 'stock_id',
  })
  stockId: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column('double precision')
  price: number;

  @Column({
    type: 'int',
    name: 'order_id',
  })
  orderId: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
