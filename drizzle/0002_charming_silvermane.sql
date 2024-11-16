ALTER TABLE "Users" DROP CONSTRAINT "Users_username_unique";--> statement-breakpoint
ALTER TABLE "Users" DROP COLUMN IF EXISTS "username";