import { Request, Response } from "express";

import { withTryCatch } from "../../middleware/error/withTryCatch";
import { ExpModRequest } from "../../types";
import { SuccessResponse } from "../../middleware/error/types";
import { clearRefreshTokenFromCookie } from "./utils";

const logout = withTryCatch(
  async (req: Request, res: Response): Promise<SuccessResponse<null>> => {
    if ((req as ExpModRequest).user) {
      (req as ExpModRequest).user = undefined;
      clearRefreshTokenFromCookie(res);
    }
    return {
      data: null,
      statusCode: 200,
      message: "Logout successfully",
      success: true,
    };
  }
);

export default logout;
