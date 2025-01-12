import { Request, Response } from "express";

import { HttpError, withTryCatch } from "../../middleware/error/withTryCatch";
import { verifyUserExits } from "./utils";
import { hashPassword, verifyPassword } from "../../utils/auth/passwordHash";
import { db } from "../../db";
import { User } from "../../schema/User";
import { eq } from "drizzle-orm";
import { SuccessResponse } from "../../middleware/error/types";
import { ExpModRequest } from "../../types";
import { changePasswordDataValidation } from "./utils/validation/changePassword";

const changePassword = withTryCatch(
  async (
    req: Request,
    res: Response
  ): Promise<SuccessResponse<{ email: string }>> => {
    changePasswordDataValidation(req.body);
    const { oldPassword, newPassword } = req.body;
    const email = (req as ExpModRequest).user?.email ?? "";
    if (!email) {
      throw new HttpError(404, "Authentication failed", "AUTH_FAILED");
    }

    const me = await verifyUserExits({ email });
    const isVerified = await verifyPassword({
      plainPassword: oldPassword,
      hashedPassword: me.password,
    });
    if (!isVerified) {
      throw new HttpError(401, "Password did not match", "FAILED");
    }
    const hashedPassword = await hashPassword(newPassword);
    const [updated] = await db
      .update(User)
      .set({ password: hashedPassword })
      .where(eq(User.email, email))
      .returning({ email: User.email });
    console.log({ updated });

    if (!updated.email) {
      throw new HttpError(
        401,
        "Could not update password. Please try in some time.",
        "FAILED"
      );
    }

    return {
      statusCode: 200,
      success: true,
      message: "Password updated successfully",
      data: {
        email,
      },
    };
  }
);

export default changePassword;
