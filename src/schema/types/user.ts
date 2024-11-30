import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z
    .string()
    .email()
    .max(255)
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(8)
    .max(255)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  firstName: z
    .string()
    .min(1)
    .max(255)
    .transform((name) => name.trim()),
  lastName: z
    .string()
    .min(1)
    .max(255)
    .transform((name) => name.trim()),
  phoneNumber: z.string().max(50).optional().nullable(),
  dateOfBirth: z.date().optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  emailVerified: z.boolean().default(false),
  phoneVerified: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
  lastLoginAt: z.date().optional().nullable(),
  failedLoginAttempts: z.number().int().min(0).default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  deletedAt: z.date().optional().nullable(),
});

export type UserType = z.infer<typeof UserSchema>;
