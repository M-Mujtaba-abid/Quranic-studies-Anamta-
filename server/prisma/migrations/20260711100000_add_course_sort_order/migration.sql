-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- Backfill: give existing rows a sortOrder per category based on their current
-- createdAt order, so nothing shuffles into a random order after this deploy.
WITH ordered AS (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "category" ORDER BY "createdAt" ASC) - 1 AS "rn"
  FROM "courses"
)
UPDATE "courses" AS c
SET "sortOrder" = ordered."rn"
FROM ordered
WHERE c."id" = ordered."id";

-- CreateIndex
CREATE INDEX "courses_category_sortOrder_idx" ON "courses"("category", "sortOrder");
