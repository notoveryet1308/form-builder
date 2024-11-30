import { Request, Response } from "express";
import { HttpError, withTryCatch } from "../../middleware/error/withTryCatch";

import { SuccessResponse } from "../../middleware/error/types";
import tokenManager from "../../utils/auth/PasetoTokenManager";
import { setRefreshTokenInCookie, verifyUserExits } from "./utils";

const refreshToken = withTryCatch(
  async (
    req: Request,
    res: Response
  ): Promise<SuccessResponse<{ token: string }>> => {
    const { refreshToken: previousRefreshToken } = req.cookies;

    if (!previousRefreshToken) {
      throw new HttpError(404, "Refresh token is required", "TOKEN_MISSING");
    }

    const { refreshToken, accessToken, email } =
      await tokenManager.refreshAccessToken({ previousRefreshToken });

    await verifyUserExits({ email });

    setRefreshTokenInCookie({ refreshToken, res });

    return { data: { token: accessToken }, success: true, statusCode: 201 };
  }
);

export default refreshToken;
