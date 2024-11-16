import { Request, Response, NextFunction, RequestHandler } from "express";

export interface SuccessResponse<T> {
  success: true;
  data: T;
  statusCode: number;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string | number;
    stack?: string;
  };
  statusCode: number;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface HandlerResult<T> {
  data: T;
  statusCode?: number;
  message?: string;
}

export type AsyncRequestHandler<T = any> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<HandlerResult<T> | T>;
