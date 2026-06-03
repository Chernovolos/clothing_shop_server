import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductCategory1779472322812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE products ADD COLUMN type INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE products ADD COLUMN sub_type INTEGER DEFAULT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE products DROP COLUMN sub_type;
      ALTER TABLE products DROP COLUMN type;
    `);
  }
}
