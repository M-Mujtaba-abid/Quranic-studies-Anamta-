-- CreateEnum
CREATE TYPE "EnrollmentMode" AS ENUM ('ONE_ON_ONE', 'GROUP');

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "supportedModes" "EnrollmentMode"[],

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");
