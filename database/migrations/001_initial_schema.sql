-- Manual migration for ResearchPitch
-- Target: PostgreSQL 16
-- Review before execution.
-- This file is NOT executed automatically by the application.

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "ResearcherSubmission" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "researchField" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "solutionDescription" TEXT NOT NULL,
    "attachmentPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearcherSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanySubmission" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "completionDate" TIMESTAMP(3) NOT NULL,
    "researchNeedTitle" TEXT NOT NULL,
    "researchField" TEXT NOT NULL,
    "problemDescription" TEXT NOT NULL,
    "attachmentPath" TEXT,
    "completedFormPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanySubmission_pkey" PRIMARY KEY ("id")
);
