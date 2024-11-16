import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // You can adjust this number (higher = more secure but slower)

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
