import { MigrationInterface, QueryRunner } from 'typeorm';

export class Order1781093052896 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE orders
        (
          id       serial,
          quantity integer,
          total    double precision,
          status   integer,

          CONSTRAINT pk_orders primary key (id)
        );


        CREATE TABLE order_items
        (
          id         serial,
          type       integer,
          order_id   integer,
          product_id integer,
          stock_id   integer,
          quantity   integer,
          price      double precision,

          CONSTRAINT pk_order_items primary key (id),
          CONSTRAINT fk_order_items_to_order foreign key (order_id) REFERENCES orders (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE,
          CONSTRAINT fk_order_items_to_product foreign key (product_id) REFERENCES products (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE,
          CONSTRAINT fk_order_items_to_stock foreign key (stock_id) REFERENCES stock (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE order_items;
      DROP TABLE orders;
    `);
  }
}
