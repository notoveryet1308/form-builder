import { eq } from "drizzle-orm";
import { Request } from "express";
import { db } from "../../db";
import { User } from "../../schema/User";

import { ApiResponse } from "../../middleware/error/types";
import { HttpError, withTryCatch } from "../../middleware/error/withTryCatch";
import { hashPassword } from "../../utils/auth/passwordHash";
import {
  registerUserDataType,
  registerUserDataValidation,
} from "./utils/validation/registerUser";

const registerUser = withTryCatch(
  async (req: Request): Promise<ApiResponse<{ id: number }>> => {
    registerUserDataValidation(req.body as registerUserDataType);

    const { email, password, firstName, lastName } = req.body;

    const existingUser = await db
      .select()
      .from(User)
      .where(eq(User.email, email));

    if (!existingUser) {
      throw new HttpError(404, "Email is already registered", "USER_EXITS");
    }
    const hashedPassword = await hashPassword(password);

    const [newUser] = await db
      .insert(User)
      .values({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      })
      .returning({ id: User.id });

    return { data: newUser, statusCode: 201, success: true };
  },
  201
);

export default registerUser;
