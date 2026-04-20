-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "job_type" TEXT NOT NULL DEFAULT 'Job',
    "apply_type" TEXT NOT NULL DEFAULT 'Direct Apply',
    "platform" TEXT,
    "job_link" TEXT,
    "date_applied" DATE,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "work_type" TEXT NOT NULL DEFAULT 'Onsite',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "recruiter_name" TEXT,
    "recruiter_contact" TEXT,
    "follow_up_date" DATE,
    "salary" TEXT,
    "resume_version" TEXT,
    "attachment_link" TEXT,
    "notes" TEXT,
    "status_history" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_analyses" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,
    "resume_version" TEXT,
    "experience" TEXT,
    "match_score" INTEGER NOT NULL,
    "verdict" TEXT NOT NULL,
    "full_analysis" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_usage" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "date" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "applications_clerk_user_id_idx" ON "applications"("clerk_user_id");

-- CreateIndex
CREATE INDEX "applications_clerk_user_id_status_idx" ON "applications"("clerk_user_id", "status");

-- CreateIndex
CREATE INDEX "resume_analyses_clerk_user_id_idx" ON "resume_analyses"("clerk_user_id");

-- CreateIndex
CREATE INDEX "resume_analyses_clerk_user_id_created_at_idx" ON "resume_analyses"("clerk_user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "resume_usage_clerk_user_id_key" ON "resume_usage"("clerk_user_id");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_analyses" ADD CONSTRAINT "resume_analyses_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_usage" ADD CONSTRAINT "resume_usage_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
