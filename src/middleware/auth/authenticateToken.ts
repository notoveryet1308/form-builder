import { Request, Response, NextFunction } from "express";

import tokenManager from "../../utils/auth/PasetoTokenManager";
import { HttpError } from "../error/withTryCatch";
import { clearRefreshTokenFromCookie } from "../../controllers/auth/utils";
import { ExpModRequest } from "../../types";

enum SKIP_TOKEN_VERIFICATION_ROUTE_LIST {
  LOGIN = "/api/login",
  REGISTER = "/api/register",
}

const LOGOUT = "/api/logout";

const skipTokenVerification = {
  [SKIP_TOKEN_VERIFICATION_ROUTE_LIST.LOGIN]: true,
  [SKIP_TOKEN_VERIFICATION_ROUTE_LIST.REGISTER]: true,
};

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!!skipTokenVerification[req.url as SKIP_TOKEN_VERIFICATION_ROUTE_LIST]) {
    return next();
  }
  if (req.url === LOGOUT) {
    (req as ExpModRequest).user = undefined;
    clearRefreshTokenFromCookie(res);
    return next();
  }
  const { refreshToken } = req.cookies;
  const accessToken = req.headers.authorization?.split(" ")[1] || null;

  try {
    if (!refreshToken || !accessToken) {
      throw new HttpError(400, "Token not found", "TOKEN_MISSING");
    }

    const [{ userId, email }] = await Promise.all([
      tokenManager.verifyToken(refreshToken),
      tokenManager.verifyToken(accessToken),
    ]);
    (req as ExpModRequest).user = {
      userId,
      email,
    };
    next();
  } catch (error: any) {
    clearRefreshTokenFromCookie(res);
    res.status(error.statusCode).json({ error: true, message: error.message });
  }
};

export default authenticateToken;
