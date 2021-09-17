import {MigrationInterface, QueryRunner} from "typeorm";

export class fixDate1631755301821 implements MigrationInterface {
    name = 'fixDate1631755301821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "update_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "update_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."roles" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."roles" ALTER COLUMN "update_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."roles" ALTER COLUMN "update_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."roles" ALTER COLUMN "created_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "update_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "created_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "update_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "created_at" DROP DEFAULT`);
    }

}
