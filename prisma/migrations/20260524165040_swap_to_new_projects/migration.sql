/*
  Warnings:

  - You are about to drop the `ai_resume_screener_applicants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ecommerce_analytics_applicants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sentiment_dashboard_applicants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ai_resume_screener_applicants" DROP CONSTRAINT "ai_resume_screener_applicants_clerk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ecommerce_analytics_applicants" DROP CONSTRAINT "ecommerce_analytics_applicants_clerk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sentiment_dashboard_applicants" DROP CONSTRAINT "sentiment_dashboard_applicants_clerk_user_id_fkey";

-- DropTable
DROP TABLE "ai_resume_screener_applicants";

-- DropTable
DROP TABLE "ecommerce_analytics_applicants";

-- DropTable
DROP TABLE "sentiment_dashboard_applicants";

-- CreateTable
CREATE TABLE "data_analyst_applicants" (
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

    CONSTRAINT "data_analyst_applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web_dev_applicants" (
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

    CONSTRAINT "web_dev_applicants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "data_analyst_applicants_email_idx" ON "data_analyst_applicants"("email");

-- CreateIndex
CREATE INDEX "data_analyst_applicants_status_idx" ON "data_analyst_applicants"("status");

-- CreateIndex
CREATE INDEX "data_analyst_applicants_clerk_user_id_idx" ON "data_analyst_applicants"("clerk_user_id");

-- CreateIndex
CREATE INDEX "web_dev_applicants_email_idx" ON "web_dev_applicants"("email");

-- CreateIndex
CREATE INDEX "web_dev_applicants_status_idx" ON "web_dev_applicants"("status");

-- CreateIndex
CREATE INDEX "web_dev_applicants_clerk_user_id_idx" ON "web_dev_applicants"("clerk_user_id");

-- AddForeignKey
ALTER TABLE "data_analyst_applicants" ADD CONSTRAINT "data_analyst_applicants_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "users"("clerk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "web_dev_applicants" ADD CONSTRAINT "web_dev_applicants_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "users"("clerk_id") ON DELETE SET NULL ON UPDATE CASCADE;
