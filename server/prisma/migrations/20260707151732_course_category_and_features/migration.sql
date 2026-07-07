-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "category" "EnrollmentMode" NOT NULL DEFAULT 'ONE_ON_ONE',
ADD COLUMN     "features" TEXT[];
