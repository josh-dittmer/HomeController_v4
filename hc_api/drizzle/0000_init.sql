CREATE TYPE "public"."device_type" AS ENUM('rgb_lights', 'test_device');--> statement-breakpoint
CREATE TABLE "devices" (
	"deviceId" uuid PRIMARY KEY NOT NULL,
	"secretHash" varchar(510) NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar(63) NOT NULL,
	"description" varchar(255) NOT NULL,
	"type" "device_type" NOT NULL,
	CONSTRAINT "devices_deviceId_unique" UNIQUE("deviceId")
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"ticketId" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"ticket" varchar(510) NOT NULL,
	"expiresAt" timestamp NOT NULL,
	CONSTRAINT "tickets_ticketId_unique" UNIQUE("ticketId"),
	CONSTRAINT "tickets_ticket_unique" UNIQUE("ticket")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"userId" uuid PRIMARY KEY NOT NULL,
	"name" varchar(63) NOT NULL,
	CONSTRAINT "users_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;