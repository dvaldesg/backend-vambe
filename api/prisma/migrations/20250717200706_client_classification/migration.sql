-- CreateEnum
CREATE TYPE "CommercialSector" AS ENUM ('RETAIL', 'MANUFACTURING', 'FINANCIAL_SERVICES', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'GOVERNMENT', 'NON_PROFIT', 'PROFESSIONAL_SERVICES', 'DESIGN', 'MEDIA_AND_ENTERTAINMENT', 'TOURISM', 'TRANSPORTATION', 'AGRICULTURE', 'ENERGY', 'SECURITY', 'EVENTS', 'OTHER');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('REFERRAL', 'ORGANIC_SEARCH', 'SOCIAL_MEDIA', 'PAID_AD', 'EVENT', 'COLD_OUTREACH', 'PARTNER', 'CONFERENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "InterestReason" AS ENUM ('PRICE', 'FEATURES', 'SUPPORT', 'SCALABILITY', 'SECURITY', 'COMPLIANCE', 'ROI', 'USER_EXPERIENCE', 'EFFICIENCY', 'AUTOMATION', 'PERSONALIZATION', 'INTEGRATION', 'QUALITY', 'CUSTOMER_SATISFACTION', 'TIME_SAVINGS', 'OTHER');

-- CreateEnum
CREATE TYPE "VambeModel" AS ENUM ('AXIS', 'MERCUR', 'IRIS', 'API');

-- CreateTable
CREATE TABLE "client_classifications" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commercialSector" "CommercialSector" NOT NULL,
    "leadSource" "LeadSource" NOT NULL,
    "interestReason" "InterestReason" NOT NULL,
    "clientMeetingId" INTEGER NOT NULL,
    "hasDemandPeaks" BOOLEAN NOT NULL DEFAULT false,
    "hasSeasonalDemand" BOOLEAN NOT NULL DEFAULT false,
    "estimatedDailyInteractions" INTEGER NOT NULL DEFAULT 0,
    "estimatedWeeklyInteractions" INTEGER NOT NULL DEFAULT 0,
    "estimatedMonthlyInteractions" INTEGER NOT NULL DEFAULT 0,
    "hasTechTeam" BOOLEAN NOT NULL DEFAULT false,
    "vambeModel" "VambeModel",
    "isPotentialClient" BOOLEAN NOT NULL DEFAULT false,
    "isProblemClient" BOOLEAN NOT NULL DEFAULT false,
    "isLostClient" BOOLEAN NOT NULL DEFAULT false,
    "shouldBeContacted" BOOLEAN NOT NULL DEFAULT false,
    "confidenceScore" DOUBLE PRECISION,
    "modelVersion" TEXT,

    CONSTRAINT "client_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_classifications_clientMeetingId_key" ON "client_classifications"("clientMeetingId");

-- AddForeignKey
ALTER TABLE "client_classifications" ADD CONSTRAINT "client_classifications_clientMeetingId_fkey" FOREIGN KEY ("clientMeetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
