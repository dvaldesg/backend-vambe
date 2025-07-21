-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CommercialSector" ADD VALUE 'CONSTRUCTION';
ALTER TYPE "CommercialSector" ADD VALUE 'LOGISTICS';
ALTER TYPE "CommercialSector" ADD VALUE 'REAL_ESTATE';
ALTER TYPE "CommercialSector" ADD VALUE 'TELECOMMUNICATIONS';
ALTER TYPE "CommercialSector" ADD VALUE 'HOSPITALITY';
ALTER TYPE "CommercialSector" ADD VALUE 'INSURANCE';
ALTER TYPE "CommercialSector" ADD VALUE 'FOOD_AND_BEVERAGE';
