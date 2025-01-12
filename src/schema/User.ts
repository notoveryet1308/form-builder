import {
  boolean,
  integer,
  pgTable as table,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const User = table(
  "user",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 50 }),
    dateOfBirth: timestamp("date_of_birth"),
    avatar: text("avatar"),
    emailVerified: boolean("email_verified").notNull().default(false),
    phoneVerified: boolean("phone_verified").notNull().default(false),
    twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
    lastLoginAt: timestamp("last_login_at"),
    failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [uniqueIndex("email_idx").on(table.email)]
);
