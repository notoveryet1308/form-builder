import { eq } from "drizzle-orm";
import { Response } from "express";

import { db } from "../../../db";
import { UserType } from "../../../schema/types/user";
import { User } from "../../../schema/User";

import { HttpError } from "../../../middleware/error/withTryCatch";

export const verifyUserExits = async ({
  email,
}: {
  email: string;
}): Promise<UserType> => {
  const [me] = await db.select().from(User).where(eq(User.email, email));

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
