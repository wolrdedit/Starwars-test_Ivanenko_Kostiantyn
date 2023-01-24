import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

import { NotifyService } from "@core/services/notify.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notifyService: NotifyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<Object>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
          this.notifyService.failureLong(error.message || error.error || "Unknown Error");
          return throwError(() => error);

      }),
    );
  }
}
