-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('GM', 'ADMIN', 'MODULE_USER');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('DESIGN', 'MERCHANDISING', 'PRODUCTION', 'SALES');

-- CreateEnum
CREATE TYPE "PricePoint" AS ENUM ('ENTRY', 'CORE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "VisualType" AS ENUM ('SKETCH', 'REMIX', 'MOOD', 'TECHNICAL');

-- CreateEnum
CREATE TYPE "AiLabel" AS ENUM ('REAL', 'DERIVED', 'INSPIRATION');

-- CreateEnum
CREATE TYPE "DesignStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'DROPPED');

-- CreateEnum
CREATE TYPE "SampleStage" AS ENUM ('PROTO_1', 'PROTO_2', 'SMS', 'PP_SAMPLE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MODULE_USER',
    "departmentTags" "Department"[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "success" BOOLEAN NOT NULL,
    "details" TEXT,

    CONSTRAINT "LoginLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyDoc" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "budgetCap" DECIMAL(65,30) NOT NULL,
    "skuTargetCount" INTEGER NOT NULL,
    "targetMargin" DECIMAL(65,30) NOT NULL,
    "keyDates" JSONB NOT NULL,

    CONSTRAINT "StrategyDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrendReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "sentimentScore" DOUBLE PRECISION NOT NULL,
    "keywords" TEXT[],
    "sourceUrls" TEXT[],
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrendReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinePlanItem" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "pricePoint" "PricePoint" NOT NULL,

    CONSTRAINT "LinePlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisualAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "VisualType" NOT NULL,
    "aiLabel" "AiLabel" NOT NULL,
    "confidenceScore" DOUBLE PRECISION,
    "parentId" TEXT,

    CONSTRAINT "VisualAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodBoard" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "aiDescription" TEXT,

    CONSTRAINT "MoodBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDesign" (
    "id" TEXT NOT NULL,
    "linePlanId" TEXT,
    "skuPlaceholder" TEXT NOT NULL,
    "status" "DesignStatus" NOT NULL DEFAULT 'DRAFT',
    "designerId" TEXT NOT NULL,
    "visualSketchId" TEXT,
    "techPack" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FabricOption" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "materialName" TEXT NOT NULL,
    "composition" TEXT NOT NULL,
    "supplierRef" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FabricOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sample" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "stage" "SampleStage" NOT NULL,
    "trackingId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "qaComments" JSONB,

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostSheet" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "rawMaterial" DECIMAL(65,30) NOT NULL,
    "labor" DECIMAL(65,30) NOT NULL,
    "logistics" DECIMAL(65,30) NOT NULL,
    "duty" DECIMAL(65,30) NOT NULL,
    "targetRetail" DECIMAL(65,30) NOT NULL,
    "wholesalePrice" DECIMAL(65,30) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CostSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionJob" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "factoryName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "shipDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "ProductionJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceMetric" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "sellThroughRate" DOUBLE PRECISION NOT NULL,
    "returnRate" DOUBLE PRECISION NOT NULL,
    "customerSentiment" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "meta" JSONB,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalApiKey" (
    "service" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "usageLimit" INTEGER NOT NULL,
    "currentUsage" INTEGER NOT NULL DEFAULT 0,
    "lastReset" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalApiKey_pkey" PRIMARY KEY ("service")
);

-- CreateTable
CREATE TABLE "FeatureToggle" (
    "id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "targetAudience" JSONB,

    CONSTRAINT "FeatureToggle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MoodBoardToVisualAsset" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StrategyDoc_seasonId_key" ON "StrategyDoc"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDesign_linePlanId_key" ON "ProductDesign"("linePlanId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDesign_skuPlaceholder_key" ON "ProductDesign"("skuPlaceholder");

-- CreateIndex
CREATE UNIQUE INDEX "CostSheet_designId_key" ON "CostSheet"("designId");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceMetric_sku_key" ON "PerformanceMetric"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "_MoodBoardToVisualAsset_AB_unique" ON "_MoodBoardToVisualAsset"("A", "B");

-- CreateIndex
CREATE INDEX "_MoodBoardToVisualAsset_B_index" ON "_MoodBoardToVisualAsset"("B");

-- AddForeignKey
ALTER TABLE "LoginLog" ADD CONSTRAINT "LoginLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationLog" ADD CONSTRAINT "OperationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyDoc" ADD CONSTRAINT "StrategyDoc_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinePlanItem" ADD CONSTRAINT "LinePlanItem_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualAsset" ADD CONSTRAINT "VisualAsset_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "VisualAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodBoard" ADD CONSTRAINT "MoodBoard_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDesign" ADD CONSTRAINT "ProductDesign_linePlanId_fkey" FOREIGN KEY ("linePlanId") REFERENCES "LinePlanItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDesign" ADD CONSTRAINT "ProductDesign_designerId_fkey" FOREIGN KEY ("designerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDesign" ADD CONSTRAINT "ProductDesign_visualSketchId_fkey" FOREIGN KEY ("visualSketchId") REFERENCES "VisualAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FabricOption" ADD CONSTRAINT "FabricOption_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostSheet" ADD CONSTRAINT "CostSheet_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionJob" ADD CONSTRAINT "ProductionJob_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "SystemLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoodBoardToVisualAsset" ADD CONSTRAINT "_MoodBoardToVisualAsset_A_fkey" FOREIGN KEY ("A") REFERENCES "MoodBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoodBoardToVisualAsset" ADD CONSTRAINT "_MoodBoardToVisualAsset_B_fkey" FOREIGN KEY ("B") REFERENCES "VisualAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
