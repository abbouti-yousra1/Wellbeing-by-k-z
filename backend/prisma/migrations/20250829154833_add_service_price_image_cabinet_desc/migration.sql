-- AlterTable
ALTER TABLE "public"."Cabinet" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION;
