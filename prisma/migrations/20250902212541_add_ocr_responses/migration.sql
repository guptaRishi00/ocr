-- CreateTable
CREATE TABLE "public"."ocr_responses" (
    "id" SERIAL NOT NULL,
    "originalName" TEXT,
    "extractedText" TEXT NOT NULL,
    "imageSize" INTEGER,
    "mimeType" TEXT,
    "processingTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ocr_responses_pkey" PRIMARY KEY ("id")
);
