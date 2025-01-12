CREATE TABLE IF NOT EXISTS "choice_option" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "choice_option_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"label" text NOT NULL,
	"is_correct" boolean DEFAULT false,
	"is_quiz_type" boolean DEFAULT false NOT NULL,
	"icon" text,
	CONSTRAINT "choice_option_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "form_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"should_authenticate_user" boolean DEFAULT true NOT NULL,
	"question_ids" integer[] DEFAULT '{}',
	"is_draft" boolean DEFAULT true,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "form_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_submission" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "form_submission_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"form_id" integer NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "multiple_choice_response" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "multiple_choice_response_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"submission_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"selected_options" integer[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paragraph_response" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "paragraph_response_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"submission_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"response" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "multiple_choice" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "multiple_choice_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"question_id" integer NOT NULL,
	"options" integer[] NOT NULL,
	"response" integer[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "long_text" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "long_text_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"question_id" integer NOT NULL,
	"max_length" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "short_text" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "short_text_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"question_id" integer NOT NULL,
	"max_length" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "question_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"form_id" integer NOT NULL,
	"question_id" integer DEFAULT 1 NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"is_required" boolean DEFAULT false NOT NULL,
	"callout_description" text,
	"callout_icon" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"phone_number" varchar(50),
	"date_of_birth" timestamp,
	"avatar" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"phone_verified" boolean DEFAULT false NOT NULL,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"last_login_at" timestamp,
	"failed_login_attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form" ADD CONSTRAINT "form_user_id_user_email_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "multiple_choice_response" ADD CONSTRAINT "multiple_choice_response_submission_id_form_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."form_submission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "multiple_choice_response" ADD CONSTRAINT "multiple_choice_response_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paragraph_response" ADD CONSTRAINT "paragraph_response_submission_id_form_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."form_submission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paragraph_response" ADD CONSTRAINT "paragraph_response_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "multiple_choice" ADD CONSTRAINT "multiple_choice_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "long_text" ADD CONSTRAINT "long_text_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "short_text" ADD CONSTRAINT "short_text_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "user" USING btree ("email");