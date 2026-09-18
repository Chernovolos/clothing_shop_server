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

  @Column({ name: 'np_city_ref' })
  npCityRef: string;

  @Column({ name: 'np_warehouse_ref' })
  npWarehouseRef: string;

  @Column({
    name: 'np_warehouse_lat',
    type: 'decimal',
    precision: 9,
    scale: 6,
    nullable: true,
  })
  npWarehouseLat?: number;

  @Column({
    name: 'np_warehouse_lon',
    type: 'decimal',
    precision: 9,
    scale: 6,
    nullable: true,
  })
  npWarehouseLon?: number;

  @Column({ name: 'city_name' })
  cityName: string;

  @Column({ name: 'warehouse_name' })
  warehouseName: string;

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
