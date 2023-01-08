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

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  get<TResponse>(
    url: string,
    options?: HttpOptions
  ): Promise<TResponse> {

    return firstValueFrom(this.http.get<TResponse>(this.toUrl(url), options));
  }

  delete<TResponse>(
    url: string,
    options?: HttpOptions
  ): Promise<TResponse> {
    return firstValueFrom(this.http.delete<TResponse>(this.toUrl(url), options));
  }

  post<TResponse>(
    url: string,
    toPost: any,
    options?: HttpOptions
  ): Promise<TResponse> {
    return firstValueFrom(this.http.post<TResponse>(this.toUrl(url), toPost, options));
  }

  put<TResponse>(
    url: string,
    toPost: any,
    options?: HttpOptions
  ): Promise<TResponse> {
    return firstValueFrom(this.http.put<TResponse>(this.toUrl(url), toPost, options));
  }

  patch<TResponse>(
    url: string,
    toPost: any,
    options?: HttpOptions
  ): Promise<TResponse> {
    return firstValueFrom(this.http.patch<TResponse>(this.toUrl(url), toPost, options));
  }

  private toUrl(path: string): string {
    return `${environment.baseUrl}${path}`;
  }
}
