import { z } from "zod";
import { UserSchema } from "../../../../schema/types/user";

const loginUserSchema = UserSchema.pick({
  email: true,
  password: true,
}).strict();

export type loginUserDataType = z.infer<typeof loginUserSchema>;

export const loginUserDataValidation = (data: loginUserDataType) =>
  loginUserSchema.parse(data);
