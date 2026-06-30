/*
  Warnings:

  - The primary key for the `courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `courses` table. All the data in the column will be lost.
  - Added the required column `days` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `courses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "courses" DROP CONSTRAINT "courses_pkey",
DROP COLUMN "created_at",
DROP COLUMN "is_active",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "days" TEXT NOT NULL,
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET NOT NULL,
ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");
