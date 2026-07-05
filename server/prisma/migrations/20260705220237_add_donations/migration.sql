-- CreateEnum
CREATE TYPE "DonationType" AS ENUM ('LILLAH', 'SADAQAH_JARIYAH', 'SADAQAH_NAFILLAH', 'ZAKAT');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "type" "DonationType" NOT NULL,
    "donorName" TEXT,
    "email" TEXT,
    "description" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'PKR',
    "screenshotUrl" TEXT NOT NULL,
    "screenshotPublicId" TEXT NOT NULL,
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);
