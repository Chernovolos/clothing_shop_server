import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrders1784559103175 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE orders
          ADD COLUMN first_name VARCHAR(255),
          ADD COLUMN last_name     VARCHAR(255),
          ADD COLUMN email         VARCHAR(255),
          ADD COLUMN phone         VARCHAR(20),
          ADD COLUMN comment       VARCHAR(255),
          ADD COLUMN city          VARCHAR(255),
          ADD COLUMN warehouse_ref VARCHAR(255),
          ADD COLUMN warehouse_lat DECIMAL(9, 6),
          ADD COLUMN warehouse_lon DECIMAL(9, 6),
          
          ADD COLUMN paid_at       TIMESTAMP,
          ADD COLUMN created_at    TIMESTAMP DEFAULT NOW(),
          ADD COLUMN updated_at    TIMESTAMP DEFAULT NOW();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE orders
        DROP COLUMN updated_at,
        DROP COLUMN created_at,
        DROP COLUMN paid_at,
        DROP COLUMN warehouse_lon,
        DROP COLUMN warehouse_lat,
        DROP COLUMN warehouse_ref,
        DROP COLUMN city,
        DROP COLUMN comment,
        DROP COLUMN phone,
        DROP COLUMN email,
        DROP COLUMN last_name,
        DROP COLUMN first_name;
    `);
  }
}
