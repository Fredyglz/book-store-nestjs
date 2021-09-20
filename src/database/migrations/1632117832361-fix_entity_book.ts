import {MigrationInterface, QueryRunner} from "typeorm";

export class fixEntityBook1632117832361 implements MigrationInterface {
    name = 'fixEntityBook1632117832361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."books" RENAME COLUMN "estatus" TO "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."books" RENAME COLUMN "status" TO "estatus"`);
    }

}
