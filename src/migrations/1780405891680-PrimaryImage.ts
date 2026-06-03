import { MigrationInterface, QueryRunner } from 'typeorm';

export class PrimaryImage1780405891680 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
       ALTER TABLE images ADD COLUMN is_primary BOOLEAN DEFAULT FALSE;
     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE images DROP COLUMN is_primary;
      `);
  }
}
