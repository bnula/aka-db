/*
  Warnings:

  - Added the required column `type_id` to the `institutions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "institutions" ADD COLUMN     "type_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "institution_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "institution_types_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "contacts_institutions_fk" FOREIGN KEY ("type_id") REFERENCES "institution_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
