import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../../db";
import { Users, UserType } from "../../schema/users";

import { SuccessResponse } from "../../middleware/error/types";
import { HttpError, withTryCatch } from "../../middleware/error/withTryCatch";
import { verifyPassword } from "../../utils/auth/passwordHash";
import pasetoToken from "../../utils/auth/PasetoTokenManager";

export const verifyUserExits = async ({
  email,
}: {
  email: string;
}): Promise<UserType> => {
  const [me] = await db.select().from(Users).where(eq(Users.email, email));

  if (!me) {
    throw new HttpError(
      404,
      "Either email or password is incorrect",
      "WRONG_CREDENTIAL"
    );
  }

  return me;
};

export const setRefreshTokenInCookie = ({
  res,
  refreshToken,
}: {
  res: Response;
  refreshToken: string;
}) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshTokenFromCookie = async (res: Response) => {
  res.clearCookie("refreshToken");
};
