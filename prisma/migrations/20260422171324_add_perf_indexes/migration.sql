/*
  Warnings:

  - Changed the type of `date` on the `resume_usage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "resume_usage" DROP COLUMN "date",
ADD COLUMN     "date" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "applications_clerk_user_id_follow_up_date_idx" ON "applications"("clerk_user_id", "follow_up_date");

-- CreateIndex
CREATE INDEX "applications_clerk_user_id_date_applied_idx" ON "applications"("clerk_user_id", "date_applied");

-- CreateIndex
CREATE INDEX "applications_clerk_user_id_created_at_idx" ON "applications"("clerk_user_id", "created_at");

-- CreateIndex
CREATE INDEX "resume_analyses_clerk_user_id_created_at_idx" ON "resume_analyses"("clerk_user_id", "created_at");
