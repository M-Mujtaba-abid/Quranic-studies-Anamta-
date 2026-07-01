/*
  Warnings:

  - Added the required column `preferredDays` to the `enrollments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "preferredDays" TEXT NOT NULL;
