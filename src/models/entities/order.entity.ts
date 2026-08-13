import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderPaymentType, OrderStatus } from '../../enums/order.enums';
import { OrderItem } from './order-item.entity';
import { User } from './user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  comment?: string;

  @Column()
  city: string;

  @Column({ name: 'warehouse_ref' })
  warehouseRef: string;

  @Column({
    name: 'warehouse_lat',
    type: 'decimal',
    precision: 9,
    scale: 6,
    nullable: true,
  })
  warehouseLat?: number;

  @Column({
    name: 'warehouse_lon',
    type: 'decimal',
    precision: 9,
    scale: 6,
    nullable: true,
  })
  warehouseLon?: number;

  @Column({
    name: 'paid_at',
    type: 'timestamp',
    nullable: true,
  })
  paidAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'int',
    name: 'payment_method',
  })
  paymentMethod: OrderPaymentType;

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

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
