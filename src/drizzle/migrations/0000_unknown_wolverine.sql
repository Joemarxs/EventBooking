CREATE TYPE "public"."payment_method" AS ENUM('mpesa', 'card', 'paypal');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'customer');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('open', 'pending', 'closed');--> statement-breakpoint
CREATE TABLE "customer_support" (
	"support_id" serial PRIMARY KEY NOT NULL,
	"payment_id" integer,
	"user_id" integer,
	"subject" varchar(255),
	"description" varchar(1000),
	"status" "status",
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"event_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"category" varchar(100),
	"date" date,
	"time" time,
	"ticketPrice" numeric,
	"ticketsTotal" integer,
	"ticketSold" integer DEFAULT 0,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"venue_id" integer
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"user_id" integer,
	"amount" numeric,
	"paymentStatus" boolean,
	"paymentDate" date,
	"paymentMethod" "payment_method",
	"transactionId" varchar(255),
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(100),
	"lastName" varchar(100),
	"email" varchar(150) NOT NULL,
	"password" varchar(255),
	"phone" varchar(20),
	"address" varchar(255),
	"role" "role",
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"venue_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150),
	"address" varchar(255),
	"capacity" integer,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "customer_support" ADD CONSTRAINT "customer_support_payment_id_payments_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("payment_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_support" ADD CONSTRAINT "customer_support_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_venue_id_venues_venue_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("venue_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_event_id_events_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("event_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;