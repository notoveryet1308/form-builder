import { eq } from "drizzle-orm";
import { Request } from "express";
import { db } from "../../db";
import { Users } from "../../schema/users";

import { ApiResponse } from "../../middleware/error/types";
import { HttpError, withTryCatch } from "../../middleware/error/withTryCatch";
import { hashPassword } from "../../utils/auth/passwordHash";

const registerUser = withTryCatch(
  async (req: Request): Promise<ApiResponse<{ id: number }>> => {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email));

    if (!existingUser) {
      throw new HttpError(404, "Email is already registered", "USER_EXITS");
    }
    const hashedPassword = await hashPassword(password);

    const [newUser] = await db
      .insert(Users)
      .values({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      })
      .returning({ id: Users.id });

    return { data: newUser, statusCode: 201, success: true };
  },
  201
);

export default registerUser;
