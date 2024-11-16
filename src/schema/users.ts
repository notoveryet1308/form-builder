import {
  boolean,
  pgEnum as Enum,
  integer,
  pgTable as table,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// Enums
export const userStatusEnum = Enum("status", [
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "PENDING",
]);

export const userRoleEnum = Enum("roles", [
  "ADMIN",
  "USER",
  "MODERATOR",
  "GUEST",
]);

// Users table
export const Users = table(
  "Users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),

    // Personal information
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 50 }),
    dateOfBirth: timestamp("date_of_birth"),
    avatar: text("avatar"), // URL to avatar image

    // Account status and verification
    status: userStatusEnum("status").notNull().default("PENDING"),
    role: userRoleEnum("role").notNull().default("USER"),
    emailVerified: boolean("email_verified").notNull().default(false),
    phoneVerified: boolean("phone_verified").notNull().default(false),
    twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),

    // User preferences
    //   preferences: json("preferences")
    //     .notNull()
    //     .default({
    //       language: "en",
    //       timezone: "UTC",
    //       notifications: {
    //         email: true,
    //         push: true,
    //         sms: false,
    //       },
    //       theme: "system",
    //     }),

    // Metadata
    lastLoginAt: timestamp("last_login_at"),
    lastLoginIp: varchar("last_login_ip", { length: 45 }),
    failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => {
    return {
      emailIndex: uniqueIndex("email_idx").on(table.email),
    };
  }
);

// Permissions table
// export const permissions = pgTable("permissions", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   name: varchar("name", { length: 255 }).notNull(),
//   description: text("description"),
//   scope: varchar("scope", { length: 255 }).notNull(),
//   action: varchar("action", { length: 50 }).notNull(),
//   resource: varchar("resource", { length: 255 }).notNull(),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
//   updatedAt: timestamp("updated_at").notNull().defaultNow(),
// });

// User permissions (junction table)
// export const userPermissions = pgTable("user_permissions", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   userId: uuid("user_id")
//     .notNull()
//     .references(() => users.id, {
//       onDelete: "cascade",
//     }),
//   permissionId: uuid("permission_id")
//     .notNull()
//     .references(() => permissions.id, {
//       onDelete: "cascade",
//     }),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });

// Addresses table
// export const addresses = pgTable("addresses", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   userId: uuid("user_id")
//     .notNull()
//     .references(() => users.id, {
//       onDelete: "cascade",
//     }),
//   street: varchar("street", { length: 255 }).notNull(),
//   city: varchar("city", { length: 255 }).notNull(),
//   state: varchar("state", { length: 255 }).notNull(),
//   country: varchar("country", { length: 255 }).notNull(),
//   postalCode: varchar("postal_code", { length: 20 }).notNull(),
//   isDefault: boolean("is_default").notNull().default(false),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
//   updatedAt: timestamp("updated_at").notNull().defaultNow(),
// });

// Relations
// export const usersRelations = relations(users, ({ many }) => ({
//   addresses: many(addresses),
//   permissions: many(userPermissions),
// }));

// export const addressesRelations = relations(addresses, ({ one }) => ({
//   user: one(users, {
//     fields: [addresses.userId],
//     references: [users.id],
//   }),
// }));

// export const userPermissionsRelations = relations(
//   userPermissions,
//   ({ one }) => ({
//     user: one(users, {
//       fields: [userPermissions.userId],
//       references: [users.id],
//     }),
//     permission: one(permissions, {
//       fields: [userPermissions.permissionId],
//       references: [permissions.id],
//     }),
//   })
// );

// Types for preferences
// export type UserPreferences = {
//   language: string;
//   timezone: string;
//   notifications: {
//     email: boolean;
//     push: boolean;
//     sms: boolean;
//   };
//   theme: "light" | "dark" | "system";
// };

// Example queries
// export const queries = {
//   // Get user with their addresses and permissions
//   getUserWithRelations: `
//       SELECT
//         u.*,
//         json_agg(DISTINCT a.*) as addresses,
//         json_agg(DISTINCT p.*) as permissions
//       FROM users u
//       LEFT JOIN addresses a ON a.user_id = u.id
//       LEFT JOIN user_permissions up ON up.user_id = u.id
//       LEFT JOIN permissions p ON p.id = up.permission_id
//       WHERE u.id = $1
//       GROUP BY u.id;
//     `,
// };
