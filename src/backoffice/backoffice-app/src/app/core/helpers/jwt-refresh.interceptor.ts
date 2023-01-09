import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "@core/services/auth.service";
import { catchError, Observable, switchMap, throwError } from "rxjs";

@Injectable()
export class JwtRefreshInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes('auth/signin') &&
          (error.status === 401 || error.status === 403)
        ) {
          return this.handleUnauthorizedError(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      console.log('refreshing');
      this.isRefreshing = true;
      return this.authService.refreshToken().pipe(
        switchMap(() => {
          this.isRefreshing = false;

          return next.handle(request);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();

          return throwError(() => error);
        })
      );
    }

    return next.handle(request);
  }
}

export const JwtRefreshInterceptorProvider = {
  provide: HTTP_INTERCEPTORS, useClass: JwtRefreshInterceptor, multi: true
};