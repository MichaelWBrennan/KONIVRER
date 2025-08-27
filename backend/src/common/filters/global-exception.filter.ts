import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

export interface StandardErrorResponse {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  path: string;
  method: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = "INTERNAL_SERVER_ERROR";
    let message = "Internal server error";
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
        errorCode = this.getErrorCodeFromStatus(status);
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || message;
        errorCode = responseObj.code || this.getErrorCodeFromStatus(status);
        details = responseObj.details;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unexpected error: ${exception.message}`,
        exception.stack
      );
    }

    const errorResponse: StandardErrorResponse = {
      code: errorCode,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    // Log error for monitoring
    this.logger.error(
      `HTTP ${status} Error: ${message}`,
      JSON.stringify({
        ...errorResponse,
        userAgent: request.get("user-agent"),
        ip: request.ip,
        userId: (request as any).user?.id,
        provenance: (request as any).provenance,
      })
    );

    response.status(status).json(errorResponse);
  }

  private getErrorCodeFromStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return "BAD_REQUEST";
      case HttpStatus.UNAUTHORIZED:
        return "UNAUTHORIZED";
      case HttpStatus.FORBIDDEN:
        return "FORBIDDEN";
      case HttpStatus.NOT_FOUND:
        return "NOT_FOUND";
      case HttpStatus.CONFLICT:
        return "CONFLICT";
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return "VALIDATION_ERROR";
      case HttpStatus.TOO_MANY_REQUESTS:
        return "RATE_LIMIT_EXCEEDED";
      default:
        return "INTERNAL_SERVER_ERROR";
    }
  }
}
