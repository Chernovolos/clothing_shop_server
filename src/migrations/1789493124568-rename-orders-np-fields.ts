import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameOrdersNpFields1789493124568 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE orders
        RENAME COLUMN city TO np_city_ref;
    `);
    await queryRunner.query(`
      ALTER TABLE orders
        RENAME COLUMN warehouse_ref TO np_warehouse_ref;
    `);
    await queryRunner.query(`
      ALTER TABLE orders
        RENAME COLUMN warehouse_lat TO np_warehouse_lat;
    `);
    await queryRunner.query(`
      ALTER TABLE orders
        RENAME COLUMN warehouse_lon TO np_warehouse_lon;
    `);
    await queryRunner.query(`
      ALTER TABLE orders
        ADD COLUMN city_name VARCHAR(255),
        ADD COLUMN warehouse_name VARCHAR(255);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE orders
        DROP COLUMN warehouse_name,
        DROP COLUMN city_name;
    `);
    await queryRunner.query(`
      ALTER TABLE orders
        RENAME COLUMN np_warehouse_lon TO warehouse_lon;
    `);
    await queryRunner.query(`
      ALTER TABLE orders
        RENAME COLUMN np_warehouse_lat TO warehouse_lat;
    `);
    await queryRunner.query(`
      ALTER TABLE orders
        RENAME COLUMN np_warehouse_ref TO warehouse_ref;
    `);
    await queryRunner.query(`
      ALTER TABLE orders
        RENAME COLUMN np_city_ref TO city;
    `);
  }
}