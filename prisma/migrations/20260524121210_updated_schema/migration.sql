/*
  Warnings:

  - You are about to drop the `applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resume_analyses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resume_usage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerk_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerk_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_clerk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "resume_analyses" DROP CONSTRAINT "resume_analyses_clerk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "resume_usage" DROP CONSTRAINT "resume_usage_clerk_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "clerk_id" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "applications";

-- DropTable
DROP TABLE "resume_analyses";

-- DropTable
DROP TABLE "resume_usage";

-- CreateTable
CREATE TABLE "ai_resume_screener_applicants" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "graduation_year" TEXT NOT NULL,
    "cgpa" TEXT,
    "github_url" TEXT NOT NULL,
    "resume_link" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "admin_note" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_resume_screener_applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecommerce_analytics_applicants" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "graduation_year" TEXT NOT NULL,
    "cgpa" TEXT,
    "github_url" TEXT NOT NULL,
    "resume_link" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "admin_note" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ecommerce_analytics_applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentiment_dashboard_applicants" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "graduation_year" TEXT NOT NULL,
    "cgpa" TEXT,
    "github_url" TEXT NOT NULL,
    "resume_link" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "admin_note" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sentiment_dashboard_applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internship_tracks" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "project_key" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "current_step" INTEGER NOT NULL DEFAULT 1,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "performance_rating" TEXT,
    "overall_feedback" TEXT,
    "certificate_link" TEXT,
    "lor_link" TEXT,
    "project_repo_link" TEXT,
    "evaluation_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internship_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internship_steps" (
    "id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,
    "step_number" INTEGER NOT NULL,
    "step_title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "data" JSONB,
    "admin_note" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" TEXT,
    "deadline" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internship_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_resume_screener_applicants_email_idx" ON "ai_resume_screener_applicants"("email");

-- CreateIndex
CREATE INDEX "ai_resume_screener_applicants_status_idx" ON "ai_resume_screener_applicants"("status");

-- CreateIndex
CREATE INDEX "ai_resume_screener_applicants_clerk_user_id_idx" ON "ai_resume_screener_applicants"("clerk_user_id");

-- CreateIndex
CREATE INDEX "ecommerce_analytics_applicants_email_idx" ON "ecommerce_analytics_applicants"("email");

-- CreateIndex
CREATE INDEX "ecommerce_analytics_applicants_status_idx" ON "ecommerce_analytics_applicants"("status");

-- CreateIndex
CREATE INDEX "ecommerce_analytics_applicants_clerk_user_id_idx" ON "ecommerce_analytics_applicants"("clerk_user_id");

-- CreateIndex
CREATE INDEX "sentiment_dashboard_applicants_email_idx" ON "sentiment_dashboard_applicants"("email");

-- CreateIndex
CREATE INDEX "sentiment_dashboard_applicants_status_idx" ON "sentiment_dashboard_applicants"("status");

-- CreateIndex
CREATE INDEX "sentiment_dashboard_applicants_clerk_user_id_idx" ON "sentiment_dashboard_applicants"("clerk_user_id");

-- CreateIndex
CREATE INDEX "internship_tracks_clerk_user_id_idx" ON "internship_tracks"("clerk_user_id");

-- CreateIndex
CREATE INDEX "internship_tracks_project_key_idx" ON "internship_tracks"("project_key");

-- CreateIndex
CREATE UNIQUE INDEX "internship_tracks_clerk_user_id_applicant_id_key" ON "internship_tracks"("clerk_user_id", "applicant_id");

-- CreateIndex
CREATE INDEX "internship_steps_track_id_idx" ON "internship_steps"("track_id");

-- CreateIndex
CREATE INDEX "internship_steps_status_idx" ON "internship_steps"("status");

-- CreateIndex
CREATE UNIQUE INDEX "internship_steps_track_id_step_number_key" ON "internship_steps"("track_id", "step_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "ai_resume_screener_applicants" ADD CONSTRAINT "ai_resume_screener_applicants_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "users"("clerk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecommerce_analytics_applicants" ADD CONSTRAINT "ecommerce_analytics_applicants_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "users"("clerk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentiment_dashboard_applicants" ADD CONSTRAINT "sentiment_dashboard_applicants_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "users"("clerk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internship_tracks" ADD CONSTRAINT "internship_tracks_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "users"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internship_steps" ADD CONSTRAINT "internship_steps_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "internship_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
