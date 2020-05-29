import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, pipe, catchError, throwError, of } from 'rxjs';

@Injectable()
export class BackendApiHttpInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog, private systemService: SystemService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        throwError(error);
        return of(null);
      })
    );
  }
}
