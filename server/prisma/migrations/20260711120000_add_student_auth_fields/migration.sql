-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'STUDENT';

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "password" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
