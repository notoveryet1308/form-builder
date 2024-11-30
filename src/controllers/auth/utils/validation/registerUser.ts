import { z } from "zod";
import { UserSchema } from "../../../../schema/types/user";

const registerUserSchema = UserSchema.pick({
  email: true,
  password: true,
  lastName: true,
  firstName: true,
}).strict();

export type registerUserDataType = z.infer<typeof registerUserSchema>;

export const registerUserDataValidation = (data: registerUserDataType) =>
  registerUserSchema.parse(data);
