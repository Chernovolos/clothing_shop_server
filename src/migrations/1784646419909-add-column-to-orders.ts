import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnToOrders1784646419909 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE orders
        ADD COLUMN payment_method INTEGER;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE orders
      DROP
      COLUMN payment_method INTEGER;
    `);
  }
}
