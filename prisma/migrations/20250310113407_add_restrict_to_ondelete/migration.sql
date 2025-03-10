-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_institutions_fk";

-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_positions_fk";

-- DropForeignKey
ALTER TABLE "institutions" DROP CONSTRAINT "institutions_institution_types_fk";

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_institutions_fk" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_positions_fk" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_institution_types_fk" FOREIGN KEY ("type_id") REFERENCES "institution_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
