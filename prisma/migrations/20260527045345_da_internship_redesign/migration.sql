/*
  Warnings:

  - You are about to drop the column `overall_feedback` on the `internship_tracks` table. All the data in the column will be lost.
  - You are about to drop the column `performance_rating` on the `internship_tracks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "internship_steps" ADD COLUMN     "points_awarded" INTEGER;

-- AlterTable
ALTER TABLE "internship_tracks" DROP COLUMN "overall_feedback",
DROP COLUMN "performance_rating",
ADD COLUMN     "analytical_feedback" TEXT,
ADD COLUMN     "insights_feedback" TEXT;
