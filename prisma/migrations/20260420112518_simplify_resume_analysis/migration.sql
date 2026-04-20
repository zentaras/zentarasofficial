/*
  Warnings:

  - You are about to drop the column `experience` on the `resume_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `full_analysis` on the `resume_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `job_type` on the `resume_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `resume_analyses` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "resume_analyses_clerk_user_id_created_at_idx";

-- AlterTable
ALTER TABLE "resume_analyses" DROP COLUMN "experience",
DROP COLUMN "full_analysis",
DROP COLUMN "job_type",
DROP COLUMN "role";
