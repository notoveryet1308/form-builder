import { Request } from "express";

export interface ExpModRequest extends Request {
  user:
    | {
        userId: number;
        email: string;
      }
    | undefined;
}
