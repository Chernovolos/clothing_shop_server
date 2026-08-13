import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'first_name',
    length: 255,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    name: 'last_name',
    length: 255,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 127,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 225,
  })
  email: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
