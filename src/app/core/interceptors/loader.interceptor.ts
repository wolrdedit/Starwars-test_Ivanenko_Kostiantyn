import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { LoaderService } from "@core/services/loader.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  requestsCounter: number = 0;

  constructor(private loaderService: LoaderService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.requestsCounter++;
    this.loaderService.show();
    return next.handle(request).pipe(finalize(() => {
      this.requestsCounter--;

      if (this.requestsCounter === 0) {
        return this.loaderService.hide()
      }

      return this.loaderService.show();
    }));
  }
}
