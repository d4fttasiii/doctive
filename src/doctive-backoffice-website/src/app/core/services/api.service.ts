import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

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

const DefaultHttpOptions = {
  withCredentials: true,
  responseType: 'json'
} as HttpOptions;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  get<TResponse>(
    url: string,
    options: HttpOptions = null
  ): Promise<TResponse> {

    return firstValueFrom(this.http.get<TResponse>(this.toUrl(url), options || DefaultHttpOptions));
  }

  delete<TResponse>(
    url: string,
    options: HttpOptions = null
  ): Promise<TResponse> {
    return firstValueFrom(this.http.delete<TResponse>(this.toUrl(url), options || DefaultHttpOptions));
  }

  post<TResponse>(
    url: string,
    toPost: any,
    options: HttpOptions = null
  ): Promise<TResponse> {
    return firstValueFrom(this.http.post<TResponse>(this.toUrl(url), toPost, options || DefaultHttpOptions));
  }

  put<TResponse>(
    url: string,
    toPost: any,
    options: HttpOptions = null
  ): Promise<TResponse> {
    return firstValueFrom(this.http.put<TResponse>(this.toUrl(url), toPost, options || DefaultHttpOptions));
  }

  patch<TResponse>(
    url: string,
    toPost: any,
    options: HttpOptions = null
  ): Promise<TResponse> {
    return firstValueFrom(this.http.patch<TResponse>(this.toUrl(url), toPost, options || DefaultHttpOptions));
  }

  private toUrl(path: string): string {
    return `${environment.baseUrl}${path}`;
  }
}
