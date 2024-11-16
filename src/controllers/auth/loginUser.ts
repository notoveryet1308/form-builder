import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../../db";
import { Users, UserType } from "../../schema/users";

import { ApiResponse } from "../../middleware/error/types";
import { HttpError, withTryCatch } from "../../middleware/error/withTryCatch";
import { verifyPassword } from "../../utils/auth/passwordHash";
import pasetoToken from "../../utils/auth/PasetoTokenManager";

const loginUser = withTryCatch(
  async (
    req: Request,
    res: Response
  ): Promise<ApiResponse<{ token: string; me: UserType }>> => {
    const { email, password } = req.body;

    const [me] = await db.select().from(Users).where(eq(Users.email, email));

    if (!me) {
      throw new HttpError(
        404,
        "Either email or password is incorrect",
        "WRONG_CREDENTIAL"
      );
    }

    const isCorrectPassword = await verifyPassword({
      plainPassword: password,
      hashedPassword: me.password,
    });

    if (!isCorrectPassword) {
      throw new HttpError(
        404,
        "Either email or password is incorrect",
        "WRONG_CREDENTIAL"
      );
    }

    const { refreshToken, accessToken } = await pasetoToken.generateTokenPair({
      email: me.email,
      userId: me.id,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return {
      data: { token: accessToken, me },
      statusCode: 201,
      success: true,
    };
  },
  201
);

export default loginUser;
