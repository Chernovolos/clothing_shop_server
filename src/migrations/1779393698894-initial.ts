import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1779393698894 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE products
         (
           id            serial,
           title         varchar(127),
           category_type integer,
           description   text,
           price         double precision,

           CONSTRAINT pk_products primary key (id)
         );

        CREATE TABLE colors
        (
          id   serial,
          code varchar(127),
          hex  varchar(7),

          CONSTRAINT pk_colors primary key (id)
        );

        CREATE TABLE images
        (
          id         serial,
          product_id integer,
          color_id   integer DEFAULT NULL,
          url        text,
          title      varchar(127),

          CONSTRAINT pk_images primary key (id),
          CONSTRAINT fk_images_to_color foreign key (color_id) REFERENCES colors (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL,
          CONSTRAINT fk_images_to_product foreign key (product_id) REFERENCES products (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE
        );

        CREATE TABLE stock
        (
          id           serial,
          product_id   integer,
          color_id     integer,
          product_size integer,
          available    integer,

          CONSTRAINT pk_stock primary key (id),
          CONSTRAINT pk_stock_to_product foreign key (product_id) REFERENCES products (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE,
          CONSTRAINT pk_stock_to_color foreign key (color_id) REFERENCES colors (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL
        );

        CREATE TABLE tags
        (
          id    serial,
          title varchar(255),

          CONSTRAINT pk_tags primary key (id)
        );

        CREATE TABLE product_tags
        (
          id         serial,
          tag_id     integer,
          product_id integer,

          CONSTRAINT pk_product_tags primary key (id),
          CONSTRAINT fk_product_tags_to_tag foreign key (tag_id) REFERENCES tags (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE,
          CONSTRAINT fk_product_tags_to_product foreign key (product_id) REFERENCES products (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE
        );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DROP TABLE product_tags;
        DROP TABLE tags;
        DROP TABLE stock;
        DROP TABLE images;
        DROP TABLE colors;
        DROP TABLE products;
      `,
    );
  }
}
