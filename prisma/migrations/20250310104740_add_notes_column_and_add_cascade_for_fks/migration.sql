-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_institutions_fk";

-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_positions_fk";

-- DropForeignKey
ALTER TABLE "institutions" DROP CONSTRAINT "contacts_institutions_fk";

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "notes" VARCHAR NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "institutions" ADD COLUMN     "notes" VARCHAR NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_institutions_fk" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_positions_fk" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "contacts_institutions_fk" FOREIGN KEY ("type_id") REFERENCES "institution_types"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
