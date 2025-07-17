/*
  Warnings:

  - Added the required column `salesmanName` to the `meetings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meetings" ADD COLUMN     "salesmanName" TEXT NOT NULL;
