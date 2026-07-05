-- CreateEnum
CREATE TYPE "Region" AS ENUM ('PAKISTAN', 'AUSTRALIA', 'CANADA', 'EUROPE', 'KSA', 'KUWAIT', 'QATAR', 'UAE', 'UK', 'US', 'OTHERS');

-- CreateEnum
CREATE TYPE "PackageTier" AS ENUM ('BASIC', 'INTENSIVE', 'PREMIUM', 'CUSTOM', 'NONE');

-- CreateEnum
CREATE TYPE "EnrollmentType" AS ENUM ('REGULAR', 'FREE_TRIAL');

-- CreateTable
CREATE TABLE "course_packages" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "currency" TEXT NOT NULL,
    "packageTier" "PackageTier" NOT NULL DEFAULT 'NONE',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_packages_courseId_region_packageTier_key" ON "course_packages"("courseId", "region", "packageTier");

-- AddForeignKey
ALTER TABLE "course_packages" ADD CONSTRAINT "course_packages_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DataMigration: preserve each existing course's price as its local (Pakistan) CoursePackage
-- before the price/duration/days columns are dropped from "courses" below.
INSERT INTO "course_packages" ("id", "courseId", "region", "currency", "packageTier", "title", "description", "imageUrl", "price", "createdAt", "updatedAt")
SELECT
    gen_random_uuid()::text,
    "id",
    'PAKISTAN',
    'PKR',
    'NONE',
    "title",
    "description",
    "imageUrl",
    "price",
    NOW(),
    NOW()
FROM "courses";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "days",
DROP COLUMN "duration",
DROP COLUMN "price";

-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "appliedCurrency" TEXT,
ADD COLUMN     "appliedPrice" DECIMAL(65,30),
ADD COLUMN     "enrollmentType" "EnrollmentType" NOT NULL DEFAULT 'REGULAR',
ADD COLUMN     "packageTier" "PackageTier",
ALTER COLUMN "preferredHour" DROP NOT NULL,
ALTER COLUMN "preferredMinute" DROP NOT NULL,
ALTER COLUMN "preferredPeriod" DROP NOT NULL,
ALTER COLUMN "preferredDays" DROP NOT NULL;
