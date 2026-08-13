import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRelationToOrders1782316599950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE orders
        ADD COLUMN user_id integer;

      ALTER TABLE orders
        ADD CONSTRAINT fk_orders_to_users
          FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE orders
      DROP CONSTRAINT fk_orders_to_users;
      ALTER TABLE orders
      DROP COLUMN user_id;
    `);
  }
}
