import { Request, Response } from "express";

import { UserType } from "../../schema/types/user";

import { SuccessResponse } from "../../middleware/error/types";
import { HttpError, withTryCatch } from "../../middleware/error/withTryCatch";
import pasetoToken from "../../utils/auth/PasetoTokenManager";
import { verifyPassword } from "../../utils/auth/passwordHash";
import { setRefreshTokenInCookie, verifyUserExits } from "./utils";
import { loginUserDataValidation } from "./utils/validation/loginUser";

const loginUser = withTryCatch(
  async (
    req: Request,
    res: Response
  ): Promise<SuccessResponse<{ token: string; me: UserType }>> => {
    loginUserDataValidation(req.body);
    const { email, password } = req.body;

    const me = await verifyUserExits({ email });
    const confirmPassword = await verifyPassword({
      plainPassword: password,
      hashedPassword: me.password,
    });

    if (!confirmPassword) {
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

    setRefreshTokenInCookie({ res, refreshToken });

    return {
      data: { token: accessToken, me },
      statusCode: 201,
      success: true,
    };
  },
  201
);

export default loginUser;
