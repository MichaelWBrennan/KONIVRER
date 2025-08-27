import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const userId = request.user?.id;
    const provenance = request.provenance;

    const startTime = Date.now();

    this.logger.log(
      `${method} ${url} - User: ${userId || "anonymous"}${
        provenance?.agentId ? ` - Agent: ${provenance.agentId}` : ""
      }`
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `${method} ${url} - ${duration}ms - Success${
            provenance?.agentId ? ` - Agent: ${provenance.agentId}` : ""
          }`
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.logger.error(
          `${method} ${url} - ${duration}ms - Error: ${error.message}${
            provenance?.agentId ? ` - Agent: ${provenance.agentId}` : ""
          }`
        );
        return throwError(() => error);
      })
    );
  }
}
