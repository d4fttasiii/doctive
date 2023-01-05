import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, OperatorFunction, firstValueFrom } from 'rxjs';

import { LoadingService } from './loading.service';
import { environment } from '../../../environments/environment';

export interface HttpOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  context?: HttpContext;
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService
  ) { }

  get<TResponse>(
    url: string,
    options?: HttpOptions,
    showLoading: boolean = true,
    handleErrorGlobally: boolean = true
  ): Promise<TResponse> {
    if (showLoading) {
      this.loadingService.startLoading();
    }

    if (handleErrorGlobally) {
      return firstValueFrom(this.http
        .get(this.toUrl(url), options)
        .pipe(
          this.successHandler<TResponse>(showLoading),
          this.errorHandler<TResponse>(showLoading)
        ));
    }

    return firstValueFrom(this.http.get(this.toUrl(url)).pipe(this.successHandler<TResponse>(showLoading)));
  }

  delete<TResponse>(
    url: string,
    options?: HttpOptions,
    showLoading: boolean = true,
    handleErrorGlobally: boolean = true
  ): Promise<TResponse> {
    if (showLoading) {
      this.loadingService.startLoading();
    }

    if (handleErrorGlobally) {
      return firstValueFrom(this.http
        .delete(this.toUrl(url), options)
        .pipe(
          this.successHandler<TResponse>(showLoading),
          this.errorHandler<TResponse>(showLoading)
        ));
    }

    return firstValueFrom(this.http.delete(this.toUrl(url)).pipe(this.successHandler<TResponse>(showLoading)));
  }

  post<TResponse>(
    url: string,
    toPost: any,
    options?: HttpOptions,
    showLoading: boolean = true,
    handleErrorGlobally: boolean = true,
  ): Promise<TResponse> {
    if (showLoading) {
      this.loadingService.startLoading();
    }

    if (handleErrorGlobally) {
      return firstValueFrom(this.http
        .post(this.toUrl(url), toPost, options)
        .pipe(
          this.successHandler<TResponse>(showLoading),
          this.errorHandler<TResponse>(showLoading)
        ));
    }

    return firstValueFrom(this.http.post(this.toUrl(url), toPost).pipe(this.successHandler<TResponse>(showLoading)));
  }

  put<TResponse>(
    url: string,
    toPost: any,
    options?: HttpOptions,
    showLoading: boolean = true,
    handleErrorGlobally: boolean = true
  ): Promise<TResponse> {
    if (showLoading) {
      this.loadingService.startLoading();
    }

    if (handleErrorGlobally) {
      return firstValueFrom(this.http
        .put(this.toUrl(url), toPost, options)
        .pipe(
          this.successHandler<TResponse>(showLoading),
          this.errorHandler<TResponse>(showLoading)
        ));
    }

    return firstValueFrom(this.http.put(this.toUrl(url), toPost).pipe(this.successHandler<TResponse>(showLoading)));
  }

  patch<TResponse>(
    url: string,
    toPost: any,
    options?: HttpOptions,
    showLoading: boolean = true,
    handleErrorGlobally: boolean = true
  ): Promise<TResponse> {
    if (showLoading) {
      this.loadingService.startLoading();
    }

    if (handleErrorGlobally) {
      return firstValueFrom(this.http
        .patch(this.toUrl(url), toPost, options)
        .pipe(
          this.successHandler<TResponse>(showLoading),
          this.errorHandler<TResponse>(showLoading)
        ));
    }

    return firstValueFrom(this.http.patch(this.toUrl(url), toPost).pipe(this.successHandler<TResponse>(showLoading)));
  }

  private toUrl(path: string): string {
    return `${environment.baseUrl}${path}`;
  }

  private successHandler<TResponse>(showLoading: boolean): OperatorFunction<TResponse, any> {
    return map<TResponse, any>((resp) => {
      if (showLoading) {
        this.loadingService.stopLoading();
      }
      return resp;
    });
  }

  private errorHandler<TResponse>(showLoading: boolean): OperatorFunction<TResponse, any> {
    return catchError<TResponse, any>((errorResponse) => {
      let errorMessage = '';
      let errors = null;
      if (errorResponse && errorResponse.error && errorResponse.error.errorMessageCodes) {
        errorResponse.error.errorMessageCodes.map((m) => (errorMessage += m + '\r\n'));
      } else if (
        errorResponse &&
        errorResponse.statusText &&
        errorResponse.error &&
        errorResponse.error.status
      ) {
        errorMessage = errorResponse.statusText;
        if (errorResponse.error.title) {
          errorMessage += ' - ' + errorResponse.error.title;
        }
        if (errorResponse.error.errors) {
          errors = errorResponse.error.errors;
        }
      } else {
        errorMessage = 'Server error.';
        if (errorResponse.status && errorResponse.statusText) {
          errorMessage = errorResponse.statusText + ' (' + errorResponse.status + ')';
        }
        if (errorResponse.error) {
          errors = errorResponse.error;
        }
      }

      if (errors) {
        console.error(errorMessage, 'Error details: ', errors);
      } else {
        console.error(errorMessage);
      }

      if (showLoading) {
        this.loadingService.stopLoading();
      }

      this.snackBar.open(errorMessage, 'OK', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        politeness: 'polite',
      });

      return null;
    });
  }

}
