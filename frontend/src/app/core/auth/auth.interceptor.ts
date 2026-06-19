import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';

import { AuthService } from './auth.service';

let refreshRequest$: Observable<string> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  const isRefreshRequest = req.url.includes('/api/auth/refresh');
  const request = token && !isRefreshRequest
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((error) => {
      if (error.status !== 401 || isRefreshRequest || req.url.includes('/api/auth/login')) {
        return throwError(() => error);
      }

      if (!refreshRequest$) {
        refreshRequest$ = authService.refreshAccessToken().pipe(
          finalize(() => refreshRequest$ = null),
          shareReplay(1)
        );
      }

      return refreshRequest$.pipe(
        switchMap((accessToken) => next(req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` }
        }))),
        catchError((refreshError) => {
          authService.clearSession();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
