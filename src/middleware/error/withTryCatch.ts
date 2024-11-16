import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  SuccessResponse,
  ErrorResponse,
  HandlerResult,
  AsyncRequestHandler,
} from "./types";

// Custom error class for handling HTTP errors
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

function isHandlerResult<T>(result: any): result is HandlerResult<T> {
  return result && typeof result === "object" && "data" in result;
}

export const withTryCatch = <T>(
  handler: AsyncRequestHandler,
  defaultStatusCode: number = 200
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await handler(req, res, next);

      // If the handler hasn't sent a response yet, send the result
      if (!res.headersSent && result !== undefined) {
        let statusCode: number;
        let data: T;
        let message: string | undefined;

        // Check if result is of type HandlerResult or direct data
        if (isHandlerResult<T>(result)) {
          statusCode = result.statusCode ?? defaultStatusCode;
          data = result.data;
          message = result.message;
        } else {
          statusCode = defaultStatusCode;
          data = result as T;
        }

        const response: SuccessResponse<T> = {
          success: true,
          statusCode,
          data,
          ...(message && { message }),
        };

        res.status(statusCode).json(response);
      }
    } catch (error) {
      let statusCode = 500;
      let errorResponse: ErrorResponse = {
        success: false,
        statusCode,
        error: {
          message: "Internal Server Error",
        },
      };

      // Handle different types of errors
      if (error instanceof HttpError) {
        statusCode = error.statusCode;
        errorResponse.error = {
          message: error.message,
          code: error.code,
        };
      } else if (error instanceof Error) {
        errorResponse.error = {
          message: error.message,
        };
        // Include stack trace in development environment
        if (process.env.NODE_ENV === "development") {
          errorResponse.error.stack = error.stack;
        }
      }

      // Send error response if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(statusCode).json(errorResponse);
      }
    }
  };
};
