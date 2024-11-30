import { Request } from "express";

import { SuccessResponse } from "../../middleware/error/types";
import { withTryCatch } from "../../middleware/error/withTryCatch";
import { UserType } from "../../schema/types/user";
import { ExpModRequest } from "../../types";
import { verifyUserExits } from "./utils";

const me = withTryCatch(
  async (req: Request): Promise<SuccessResponse<{ me: UserType }>> => {
    const { email } = (req as ExpModRequest).user ?? { email: "" };
    const me = await verifyUserExits({ email });

    return {
      data: { me },
      success: true,
      statusCode: 200,
    };
  }
);
export default me;
