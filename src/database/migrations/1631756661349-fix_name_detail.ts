import {MigrationInterface, QueryRunner} from "typeorm";

export class fixNameDetail1631756661349 implements MigrationInterface {
    name = 'fixNameDetail1631756661349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "update_at" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "update_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "name" SET NOT NULL`);
    }

}
