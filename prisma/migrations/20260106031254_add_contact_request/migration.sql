-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('HARDWARE_REPAIR', 'SOFTWARE_DEV', 'DEVSECOPS_CONSULTING', 'OTHER');

-- CreateEnum
CREATE TYPE "BudgetRange" AS ENUM ('UNKNOWN', 'LESS_THAN_500', 'FROM_500_TO_2K', 'FROM_2K_TO_10K', 'MORE_THAN_10K');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'CONVERTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" TEXT NOT NULL,
    "type" "ServiceType" NOT NULL DEFAULT 'OTHER',
    "designation" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "message" TEXT NOT NULL,
    "budget" "BudgetRange" NOT NULL DEFAULT 'UNKNOWN',
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactRequest_createdAt_idx" ON "ContactRequest"("createdAt");

-- CreateIndex
CREATE INDEX "ContactRequest_status_idx" ON "ContactRequest"("status");

-- CreateIndex
CREATE INDEX "ContactRequest_type_idx" ON "ContactRequest"("type");
