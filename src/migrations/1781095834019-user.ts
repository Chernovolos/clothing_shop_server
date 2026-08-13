import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1781095834019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE users
        (
          id         serial,
          first_name varchar(255),
          last_name   varchar(255),
          password   varchar(127),
          email      varchar(255),

          CONSTRAINT pk_users primary key (id)
        )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE users;
    `);
  }
}
