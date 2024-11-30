import { z } from "zod";
import { UserSchema } from "../../../../schema/types/user";

const passwordSchema = UserSchema.shape.password

const changePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
  })
  .strict();

export type changePasswordDataType = z.infer<typeof changePasswordSchema>;

export const changePasswordDataValidation = (data: changePasswordDataType) =>
  changePasswordSchema.parse(data);
