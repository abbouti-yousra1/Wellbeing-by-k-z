/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Service` table. All the data in the column will be lost.
  - Added the required column `serviceVariantId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Reservation" DROP CONSTRAINT "Reservation_serviceId_fkey";

-- AlterTable
ALTER TABLE "public"."Reservation" DROP COLUMN "serviceId",
ADD COLUMN     "serviceVariantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Service" DROP COLUMN "duration",
DROP COLUMN "price";

-- CreateTable
CREATE TABLE "public"."ServiceVariant" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceVariant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ServiceVariant" ADD CONSTRAINT "ServiceVariant_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_serviceVariantId_fkey" FOREIGN KEY ("serviceVariantId") REFERENCES "public"."ServiceVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
