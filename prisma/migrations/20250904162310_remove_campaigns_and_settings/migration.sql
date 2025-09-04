-- DropForeignKey
ALTER TABLE "public"."email_logs" DROP CONSTRAINT "email_logs_contactId_fkey";

-- DropForeignKey
ALTER TABLE "public"."email_logs" DROP CONSTRAINT "email_logs_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "public"."email_campaigns" DROP CONSTRAINT "email_campaigns_userId_fkey";

-- DropTable
DROP TABLE "public"."email_logs";

-- DropTable
DROP TABLE "public"."email_campaigns";
