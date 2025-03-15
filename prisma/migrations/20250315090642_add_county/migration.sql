-- AlterTable
ALTER TABLE "institutions" ADD COLUMN     "county_id" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "counties" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "county_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_counties_fk" FOREIGN KEY ("county_id") REFERENCES "counties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
